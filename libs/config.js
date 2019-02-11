/**
 create and export configuration variables
 */

 //container for all environments
 let environments = {}

 //staging {default} environment
 environments.staging = {
     'port' : 3000,
     'envName' : 'staging',
     'hashingSecret' : 'thisIsASecret'
 };
 
 //production environment
 environments.production = {
     'port' : 5000,
     'envName' : 'production',
     'hashingSecret' : 'thisIsASecretToo'
 };
 
 //determine current environmnet
 let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
 
 //check is current environment one of {environments} that was mentioned
 let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;
 
 //exports module
 module.exports = environmentToExport;