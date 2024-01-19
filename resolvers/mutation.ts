import { ContactModel, ContactModelType } from "../db/mongoTypes.ts";
import { GraphQLError } from "graphql";
import { NINJA_KEY } from "../main.ts";

export const Mutation = {
    deleteContact: async(_:unknown, args: {id: string}): Promise<boolean> => {
        try {
            const contact = await ContactModel.findByIdAndDelete({_id: args.id}).exec();
            if(!contact){
                return false;
            }
            else{
                return true;
            }
        }catch (e){
            throw new GraphQLError(e);
        }
    },
    addContact: async(_:unknown, args: {name: string, number: string}): Promise<ContactModelType> => {
        try{
            const {name, number} = args;
            
            //Validacion del numero
            const urlValidNumber = "https://api.api-ninjas.com/v1/validatephone?number="+number;
            const response1 = await fetch(urlValidNumber, {
                headers: {
                    'X-Api-Key': NINJA_KEY as string
                }
            })
            const json1 = await response1.json();
            const valid = json1.is_valid;
            if(valid==false){
                throw new GraphQLError("Se realizará en el lugar del código que sea más oportuno");
            }
            const numberNew = json1.format_international;
            const country = json1.country;
            const numberOwn = await ContactModel.findOne({number: numberNew});
            if(numberOwn){
                throw new GraphQLError("El numero ya está en uso");
            }
            //Saber con la URL de Country, la capital de ese país
            const urlCountry = "https://api.api-ninjas.com/v1/country?name="+country;
            const response2 = await fetch(urlCountry, {
                headers: {
                    'X-Api-Key': NINJA_KEY as string
                }
            })
            const json2 = await response2.json();
            const capital = json2[0].capital;
            //Con la capital, conseguir el datetime actual del lugar
            const urlWorldTime = "https://api.api-ninjas.com/v1/worldtime?city="+capital;
            const response3 = await fetch(urlWorldTime, {
                headers: {
                    'X-Api-Key': NINJA_KEY as string
                }
            })
            const json3 = await response3.json();
            const datetime = json3.datetime;

            //Crear el contacto
            const newContact = new ContactModel({name, number: numberNew, country, datetime, capital});
            await newContact.save();

            return newContact;

        }catch(e){
            throw new GraphQLError(e);
        }
    },
    updateContact: async(_:unknown, args: {id: string, name: string, numero: string}): Promise<ContactModelType> =>{
        try{
            const {name, numero} = args;
            const contacto = await ContactModel.findById({_id: args.id}).exec();
            if(!contacto){
                throw new GraphQLError("No existe este usuario");
            }
            if(numero){//Por si mete un nuevo numero, cambiar el pais y el datetime
                const urlValidNumber = "https://api.api-ninjas.com/v1/validatephone?number="+numero;
                const response1 = await fetch(urlValidNumber, {
                    headers: {
                        'X-Api-Key': NINJA_KEY as string
                    }
                })
                const json1 = await response1.json();
                const valid = json1.is_valid;
                if(valid==false){
                    throw new GraphQLError("Se realizará en el lugar del código que sea más oportuno");
                }
                const numberNew = json1.format_international;
                const country = json1.country;
                const numberOwn = await ContactModel.findOne({number: numberNew});
                if(numberOwn){
                    throw new GraphQLError("El numero ya está en uso");
                }
                const urlCountry = "https://api.api-ninjas.com/v1/country?name="+country;
                const response2 = await fetch(urlCountry, {
                    headers: {
                        'X-Api-Key': NINJA_KEY as string
                    }
                })
                const json2 = await response2.json();
                const capital = json2[0].capital;
                //Con la capital, conseguir el datetime actual del lugar
                const urlWorldTime = "https://api.api-ninjas.com/v1/worldtime?city="+capital;
                const response3 = await fetch(urlWorldTime, {
                    headers: {
                        'X-Api-Key': NINJA_KEY as string
                    }
                })
                const json3 = await response3.json();
                const datetime = json3.datetime;
    
                //Crear el contacto si hay nuevo nombre tambien
                if(name){
                    const contactUpdate = await ContactModel.findByIdAndUpdate(
                        {_id: args.id},
                        {name, number: numberNew, country, datetime, capital},
                        {new: true}
                    ).exec();
                    if(!contactUpdate){
                        throw new GraphQLError("No se pudo actualizar");
                    }
                    await contactUpdate.save();
                    return contactUpdate;
                }else{
                    const contactUpdate = await ContactModel.findByIdAndUpdate(
                        {_id: args.id},
                        {number: numberNew, country, datetime},
                        {new: true}
                    ).exec();
                    if(!contactUpdate){
                        throw new GraphQLError("No se pudo actualizar");
                    }
                    await contactUpdate.save();
                    return contactUpdate;
                }
            }else if(!numero){
                const contactUpdate = await ContactModel.findByIdAndUpdate(
                    {_id: args.id},
                    {name},
                    {new: true}
                ).exec();
                if(!contactUpdate){
                    throw new GraphQLError("No se pudo actualizar");
                }
                await contactUpdate.save();
                return contactUpdate;
            }else{
                throw new GraphQLError("No hay nuevo nombre o numero")
            }

        }catch(e){
            throw new GraphQLError(e);
        }
    }

};