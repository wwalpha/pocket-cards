//
//  EnvironmentVariables.swift
//  PocketCards
//
//  Created by macmini on 2022/03/09.
//

import Foundation

let AWS_REGION: String = ProcessInfo.processInfo.environment["AWS_REGION"]!
let COGNITO_IDENTITY_POOL_ID: String = ProcessInfo.processInfo.environment["COGNITO_IDENTITY_POOL_ID"]!
let COGNITO_POOL_ID: String = ProcessInfo.processInfo.environment["COGNITO_POOL_ID"]!
let COGNITO_APP_CLIENT_ID: String = ProcessInfo.processInfo.environment["COGNITO_APP_CLIENT_ID"]!
let COGNITO_WEB_DOMAIN: String = ProcessInfo.processInfo.environment["COGNITO_WEB_DOMAIN"]!
//let API_URL: String = ProcessInfo.processInfo.environment["API_URL"]!

#if DEBUG
let API_URL: String = "https://api.pkc.onecloudlabo.com"
#else
let API_URL: String = "https://api.pkc.aws-handson.com"
#endif

//let AWS_CONFIGURATION = """
//{
//    "UserAgent": "aws-amplify/cli",
//    "Version": "0.1.0",
//    "IdentityManager": {
//        "Default": {}
//    },
//    "CredentialsProvider": {
//        "CognitoIdentity": {
//            "Default": {
//                "PoolId": "\(COGNITO_IDENTITY_POOL_ID)",
//                "Region": "\(AWS_REGION)"
//            }
//        }
//    },
//    "CognitoUserPool": {
//        "Default": {
//            "PoolId": "\(COGNITO_POOL_ID)",
//            "AppClientId": "\(COGNITO_APP_CLIENT_ID)",
//            "Region": "\(AWS_REGION)"
//        }
//    },
//    "Auth": {
//        "Default": {
//            "OAuth": {
//                "WebDomain": "\(COGNITO_WEB_DOMAIN)",
//                "AppClientId": "\(COGNITO_APP_CLIENT_ID)",
//                "SignInRedirectURI": "myapp://",
//                "SignOutRedirectURI": "myapp://",
//                "Scopes": [
//                    "phone",
//                    "email",
//                    "openid",
//                    "profile",
//                    "aws.cognito.signin.user.admin"
//                ]
//            },
//            "authenticationFlowType": "USER_SRP_AUTH",
//            "socialProviders": [],
//            "usernameAttributes": [
//                "EMAIL"
//            ],
//            "signupAttributes": [
//                "EMAIL"
//            ],
//            "passwordProtectionSettings": {
//                "passwordPolicyMinLength": 8,
//                "passwordPolicyCharacters": []
//            },
//            "mfaConfiguration": "OFF",
//            "mfaTypes": [
//                "SMS"
//            ],
//            "verificationMechanisms": [
//                "EMAIL"
//            ]
//        }
//    }
//}
//""".data(using: .utf8)


//let AMPLIFY_CONFIGURATION = """
//{
//  "UserAgent": "aws-amplify-cli/2.0",
//  "Version": "1.0",
//  "auth": {
//    "plugins": {
//      "awsCognitoAuthPlugin": {
//        "UserAgent": "aws-amplify/cli",
//        "Version": "0.1.0",
//        "IdentityManager": {
//          "Default": {}
//        },
//        "CredentialsProvider": {
//          "CognitoIdentity": {
//            "Default": {
//              "PoolId": "\(COGNITO_IDENTITY_POOL_ID)",
//              "Region": "\(AWS_REGION)"
//            }
//          }
//        },
//        "CognitoUserPool": {
//          "Default": {
//            "PoolId": "\(COGNITO_POOL_ID)",
//            "AppClientId": "\(COGNITO_APP_CLIENT_ID)",
//            "Region": "\(AWS_REGION)"
//          }
//        },
//        "Auth": {
//          "Default": {
//            "OAuth": {
//              "WebDomain": "dev-pkc.auth.ap-northeast-1.amazoncognito.com",
//              "AppClientId": "503leveidc92dss87gf1e3sm9i",
//              "WebDomain": "\(COGNITO_WEB_DOMAIN)",
//              "AppClientId": "\(COGNITO_APP_CLIENT_ID)",
//              "Scopes": ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
//            },
//            "authenticationFlowType": "USER_SRP_AUTH",
//            "socialProviders": [],
//            "usernameAttributes": ["EMAIL"],
//            "signupAttributes": ["EMAIL"],
//            "passwordProtectionSettings": {
//              "passwordPolicyMinLength": 8,
//              "passwordPolicyCharacters": []
//            },
//            "mfaConfiguration": "OFF",
//            "mfaTypes": ["SMS"],
//            "verificationMechanisms": ["EMAIL"]
//          }
//        }
//      }
//    }
//  }
//}
//""".data(using: .utf8)


#if DEBUG
let AMPLIFY_CONFIGURATION = """
{
  "UserAgent": "aws-amplify-cli/2.0",
  "Version": "1.0",
  "auth": {
    "plugins": {
      "awsCognitoAuthPlugin": {
        "UserAgent": "aws-amplify/cli",
        "Version": "0.1.0",
        "IdentityManager": {
          "Default": {}
        },
        "CredentialsProvider": {
          "CognitoIdentity": {
            "Default": {
              "PoolId": "ap-northeast-1:48cf19ae-8444-45fa-941d-a99a8074de4e",
              "Region": "ap-northeast-1"
            }
          }
        },
        "CognitoUserPool": {
          "Default": {
            "PoolId": "ap-northeast-1_xnk5dRyF0",
            "AppClientId": "1f3etlgg9p34q9u6toou3dcihs",
            "Region": "ap-northeast-1"
          }
        },
        "Auth": {
          "Default": {
            "OAuth": {
              "WebDomain": "dev-pkc.auth.ap-northeast-1.amazoncognito.com",
              "AppClientId": "1f3etlgg9p34q9u6toou3dcihs",
              "SignInRedirectURI": "myapp://",
              "SignOutRedirectURI": "myapp://",
              "Scopes": ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
            },
            "authenticationFlowType": "USER_SRP_AUTH",
            "socialProviders": [],
            "usernameAttributes": ["EMAIL"],
            "signupAttributes": ["EMAIL"],
            "passwordProtectionSettings": {
              "passwordPolicyMinLength": 8,
              "passwordPolicyCharacters": []
            },
            "mfaConfiguration": "OFF",
            "mfaTypes": ["SMS"],
            "verificationMechanisms": ["EMAIL"]
          }
        }
      }
    }
  }
}
""".data(using: .utf8)
#else
let AMPLIFY_CONFIGURATION = """
{
  "UserAgent": "aws-amplify-cli/2.0",
  "Version": "1.0",
  "auth": {
    "plugins": {
      "awsCognitoAuthPlugin": {
        "UserAgent": "aws-amplify/cli",
        "Version": "0.1.0",
        "IdentityManager": {
          "Default": {}
        },
        "CredentialsProvider": {
          "CognitoIdentity": {
            "Default": {
              "PoolId": "us-east-1:a54173f8-ef2a-465a-851d-27d94ee5aa8e",
              "Region": "us-east-1"
            }
          }
        },
        "CognitoUserPool": {
          "Default": {
            "PoolId": "us-east-1_nGsqsUuVj",
            "AppClientId": "7g8su7434uroo96kat1i2clk7v",
            "Region": "us-east-1"
          }
        },
        "Auth": {
          "Default": {
            "OAuth": {
              "WebDomain": "prod-pkc.auth.us-east-1.amazoncognito.com",
              "AppClientId": "7g8su7434uroo96kat1i2clk7v",
              "SignInRedirectURI": "myapp://",
              "SignOutRedirectURI": "myapp://",
              "Scopes": ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
            },
            "authenticationFlowType": "USER_SRP_AUTH",
            "socialProviders": [],
            "usernameAttributes": ["EMAIL"],
            "signupAttributes": ["EMAIL"],
            "passwordProtectionSettings": {
              "passwordPolicyMinLength": 8,
              "passwordPolicyCharacters": []
            },
            "mfaConfiguration": "OFF",
            "mfaTypes": ["SMS"],
            "verificationMechanisms": ["EMAIL"]
          }
        }
      }
    }
  }
}
""".data(using: .utf8)
#endif
