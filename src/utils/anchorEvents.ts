import { Idl } from "@coral-xyz/anchor/dist/cjs/idl";
import { BorshEventCoder} from "@coral-xyz/anchor";
import * as KyogenIDL from "../idls/kyogen.json";
import * as StructuresIDL from "../idls/structures.json";


export const KyogenEventCoder = new BorshEventCoder(KyogenIDL as Idl);

export const StructuresEventCoder = new BorshEventCoder(StructuresIDL as Idl);
