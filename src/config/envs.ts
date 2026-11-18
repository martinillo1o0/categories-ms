
import  'dotenv/config';
import joi from 'joi';

interface EnvVars{
PORT:number;

}
const envsShema= joi.object<EnvVars>({

PORT: joi.number().integer().min(1).max(65535).required(),


})
.unknown(true);

const result = envsShema.validate(process.env, {abortEarly:false});

if (result.error){
throw new Error(`Config validation: ${result.error.message}`);

}
const envVars = result.value;

export const envs={
    port:envVars.PORT,


}as const;
//Schema devuelve el valor o el error
