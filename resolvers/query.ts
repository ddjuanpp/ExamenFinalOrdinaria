import { ContactModel, ContactModelType } from "../db/mongoTypes.ts";
import { GraphQLError } from "graphql";
import { NINJA_KEY } from "../main.ts";

export const Query = {
    getContact: async (_:unknown, args: {id: string}): Promise<ContactModelType> =>{
        try{
            const contactExist = await ContactModel.findById({_id: args.id}).exec();

            if(!contactExist){
                throw new GraphQLError("Contacto no encontrado");
            }

            const urlWorldTime = "https://api.api-ninjas.com/v1/worldtime?city="+contactExist.capital;
            const response3 = await fetch(urlWorldTime, {
                headers: {
                    'X-Api-Key': NINJA_KEY as string
                }
            })
            const json3 = await response3.json();
            const datetimeNew = json3.datetime;

            const contactUpdate = await ContactModel.findByIdAndUpdate(
                {_id: args.id},
                {datetime: datetimeNew},
                {new: true}
            ).exec();
            if(!contactUpdate){
                throw new GraphQLError("Error");
            }
            await contactUpdate.save();
            return contactUpdate;

        }catch(e){
            throw new GraphQLError(e);
        }
    },
    getContacts: async (_:unknown ): Promise<Array<ContactModelType>> =>{
        try{
            const contactos = await ContactModel.find().exec();
            if(!contactos){
                throw new GraphQLError("Contactos no encontrados");
            }
            return contactos;
        }catch(e){
            throw new GraphQLError(e);
        }
    },
};