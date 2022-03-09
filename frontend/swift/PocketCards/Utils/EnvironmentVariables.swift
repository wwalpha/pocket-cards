//
//  EnvironmentVariables.swift
//  PocketCards
//
//  Created by macmini on 2022/03/09.
//

import Foundation

let AWS_REGION: String = ProcessInfo.processInfo.environment["AWS_REGION"]!
let COGNITO_POOL_ID: String = ProcessInfo.processInfo.environment["COGNITO_POOL_ID"]!
let COGNITO_APP_CLIENT_ID: String = ProcessInfo.processInfo.environment["COGNITO_APP_CLIENT_ID"]!
let COGNITO_WEB_DOMAIN: String = ProcessInfo.processInfo.environment["COGNITO_WEB_DOMAIN"]!


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
              "PoolId": "\(COGNITO_POOL_ID)",
              "Region": "\(AWS_REGION)"
            }
          }
        },
        "CognitoUserPool": {
          "Default": {
            "PoolId": "\(COGNITO_POOL_ID)",
            "AppClientId": "\(COGNITO_APP_CLIENT_ID)",
            "Region": "\(AWS_REGION)"
          }
        },
        "Auth": {
          "Default": {
            "OAuth": {
              "WebDomain": "\(COGNITO_WEB_DOMAIN)",
              "AppClientId": "\(COGNITO_APP_CLIENT_ID)",
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


let AWS_CONFIGURATION = """
{
    "UserAgent": "aws-amplify/cli",
    "Version": "0.1.0",
    "IdentityManager": {
        "Default": {}
    },
    "CredentialsProvider": {
        "CognitoIdentity": {
            "Default": {
                "PoolId": "\(COGNITO_POOL_ID)",
                "Region": "\(AWS_REGION)"
            }
        }
    },
    "CognitoUserPool": {
        "Default": {
            "PoolId": "\(COGNITO_POOL_ID)",
            "AppClientId": "\(COGNITO_APP_CLIENT_ID)",
            "Region": "\(AWS_REGION)"
        }
    },
    "Auth": {
        "Default": {
            "OAuth": {
                "WebDomain": "\(COGNITO_WEB_DOMAIN)",
                "AppClientId": "\(COGNITO_APP_CLIENT_ID)",
                "SignInRedirectURI": "myapp://",
                "SignOutRedirectURI": "myapp://",
                "Scopes": [
                    "phone",
                    "email",
                    "openid",
                    "profile",
                    "aws.cognito.signin.user.admin"
                ]
            },
            "authenticationFlowType": "USER_SRP_AUTH",
            "socialProviders": [],
            "usernameAttributes": [
                "EMAIL"
            ],
            "signupAttributes": [
                "EMAIL"
            ],
            "passwordProtectionSettings": {
                "passwordPolicyMinLength": 8,
                "passwordPolicyCharacters": []
            },
            "mfaConfiguration": "OFF",
            "mfaTypes": [
                "SMS"
            ],
            "verificationMechanisms": [
                "EMAIL"
            ]
        }
    }
}
""".data(using: .utf8)
