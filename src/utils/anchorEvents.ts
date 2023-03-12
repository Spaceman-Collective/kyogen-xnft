import { Idl } from "@coral-xyz/anchor/dist/cjs/idl";
import { BorshEventCoder} from "@coral-xyz/anchor";
import * as KyogenIDL from "../idls/kyogen.json";


export const KyogenEventCoder = new BorshEventCoder(KyogenIDL as Idl);
