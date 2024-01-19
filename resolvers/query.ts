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

            return contactExist;

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