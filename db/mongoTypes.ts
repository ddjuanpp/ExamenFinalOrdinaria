import mongoose from "mongoose";
import { Contact } from "../types.ts";

const Schema = mongoose.Schema;

const contactSchema = new Schema(
    {
        name: {type: String, required: true },
        number: {type: String, required: true},
        country: {type: String, required: true},
        datetime: {type: String, required: true},
        capital: {type: String, required: true},
    },
    { timestamps: true }
);

export type ContactModelType = mongoose.Document & Omit<Contact, "id">;

export const ContactModel = mongoose.model<ContactModelType>("Contact", contactSchema);