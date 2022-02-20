module.exports = {
  "swaggerDefinition":{
    "openapi": "3.0.0",
    //"swagger":"2.0",
    "info": {
      "title": "Alcancia API",
      "description": "",
      "version": "1.0"
    },
    "servers": [
      {
        "url": "https://virtserver.swaggerhub.com/royers/Alcancia/1.0",
        "description": "AlcanciaBackend"
      },
      {
        "url": "https://royerdonnetarenas.tech/",
        "description": "AlcanciaBackend"
      },
      {
        "url": "http://127.0.0.1:8000/",
        "description": "AlcanciaBackendLocal"
      },
      {
        "url": "https://2a95-2806-2f0-6060-509-22ed-7127-368a-2a16.ngrok.io",
        "description": "ngrok"
      }
    ],
    "tags": [
      {
        "name": "users",
        "description": "Everything about users",
        "externalDocs": {
          "description": "Find out more",
          "url": "http://swagger.io"
        }
      }
    ],
    "paths": {
      "/api/users/{uid}": {
        "get": {
          "tags": [
            "users"
          ],
          "summary": "Returns user basic information.",
          "description": "User endpoin to retrive basic user information",
          "parameters": [
            {
              "name": "uid",
              "in": "path",
              "description": "The ID of the user to return.",
              "required": true,
              "style": "simple",
              "explode": false,
              "schema": {
                "type": "string",
                "example": "wzjhbbxemra4goFJQfih2uoNKnw2"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/inline_response_200"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized."
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "No user info"
            }
          },
          "security": [
            {
              "BearerAuth": []
            }
          ]
        }
      },
      "/api/users/{uid}/deposits": {
        "get": {
          "tags": [
            "user"
          ],
          "summary": "Returns an array of user deposits.",
          "description": "User endpoin to retrive all user deposits, sorted by date",
          "parameters": [
            {
              "name": "uid",
              "in": "path",
              "description": "The ID of the user to return.",
              "required": true,
              "style": "simple",
              "explode": false,
              "schema": {
                "type": "string",
                "example": "wzjhbbxemra4goFJQfih2uoNKnw2"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/deposits"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized."
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "No user info"
            }
          },
          "security": [
            {
              "BearerAuth": []
            }
          ]
        }
      },
      "/api/users/{uid}/balance": {
        "get": {
          "tags": [
            "user"
          ],
          "summary": "Returns the updated user balance and a timestamp.",
          "description": "This endpoint calculates the user balance fixed to 2 decimals, updating the user collection {balance & lastDateUpdatedBalace}",
          "parameters": [
            {
              "name": "uid",
              "in": "path",
              "description": "The ID of the user to query.",
              "required": true,
              "style": "simple",
              "explode": false,
              "schema": {
                "type": "string",
                "example": "wzjhbbxemra4goFJQfih2uoNKnw2"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "balance": {
                        "type": "number",
                        "example": 300.45
                      },
                      "timestamp": {
                        "type": "string",
                        "example":"2022-02-17T20:41:06.527Z"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized."
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "No user info"
            }
          },
          "security": [
            {
              "BearerAuth": []
            }
          ]
        }
      },
      "/api/withdraws": {
        "post": {
          "tags": [
            "withdraws"
          ],
          "parameters":[
              {"$ref": "#/components/parameters/amount"},
              {"$ref": "#/components/parameters/country"},
              {"$ref": "#/components/parameters/account"},
              {"$ref": "#/components/parameters/beneficiary"},
            ]
          ,
          "summary": "Create a new withdraw order",
          "description": "This endpoint creates a new withdraw order to be process",
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "UID": {
                        "type": "string",
                        "example": "wzjhbbxemra4goFJQfih2uoNKnw2",
                        "description":"user uid"
                      },
                      "UUID": {
                        "type": "string",
                        "example": "88368f2a-d5db-47d8-a05f-534fab0a0045",
                        "description": "unic transaction identifier"
                      },
                      "cratedAt": {
                        "type": "string",
                        "example":"2022-02-17T20:41:06.527Z"
                      },
                      "promisedDay": {
                        "type": "string",
                        "example":"2022-02-17T20:41:06.527Z"
                      },
                      "status": {
                        "type": "string",
                        "example": "pending"
                      },
                      "details": {
                        "type": "object",
                        "properties": {
                          "amount": {
                            "type": "number",
                            "example": 20
                          },
                          "oldBalance": {
                            "type": "number",
                            "example": 100
                          },
                          "newBalance": {
                            "type": "number",
                            "example": 80
                          },
                        }  
                      },    
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized."
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "No user info"
            }
          },
          "security": [
            {
              "BearerAuth": []
            }
          ]
        }
      },
    },
    "components": {
      "parameters": {
        "amount": {
          "in":["body"],
          "name": "amount",
          "required": "true",
          "schema": {
            "type": "number",
            "min": 20,
            "max": 300,
            "example": 250.32 
          }
        },
        "country": {
          "in":["body"],
          "name": "country",
          "required": "true",
          "schema": {
            "type": "string",
            "example": "MEX"
          }
        },
        "beneficiary": {
          "in":["body"],
          "name": "beneficiary",
          "required": "true",
          "schema": {
            "type": "string",
            "example": "Royer Donnet Arenas"
          }
        },
        "account": {
          "in":["body"],
          "name": "account",
          "required": "true",
          "schema": {
            "type": "string",
            "example": "5512-4321-4353-4321"
          }
        },
      },
      "schemas": {
        "deposits": {
          "type": "object",
          "properties": {
            "created_time": {
              "type": "string",
              "example": "022-01-24T20:38:37Z"
            },
            "id": {
              "type": "string",
              "example": "40034652B87541704"
            },
            "paypal_id": {
              "type": "string",
              "example": "40034652B87541704"
            },
            "gross_amount": {
              "type": "number",
              "example": 400.3
            },
            "net_amount": {
              "type": "number",
              "example": 305.5
            },
            "paypal_fee": {
              "type": "number",
              "example": 5.5
            },
            "status": {
              "type": "string",
              "example": "COMPLETED"
            },
            "payer": {
              "$ref": "#/components/schemas/deposits_payer"
            }
          }
        },
        "inline_response_200": {
          "type": "object",
          "properties": {
            "uid": {
              "type": "string",
              "example": "wzjhbbxemra4goFJQfih2uoNKnw2"
            },
            "name": {
              "type": "string",
              "example": "Juan Diego"
            },
            "last_name": {
              "type": "string",
              "example": "Oliva"
            },
            "email": {
              "type": "string",
              "example": "juandi@buildcapital.xyz"
            },
            "balance": {
              "type": "number",
              "example": 50.69
            }
          }
        },
        "deposits_payer_name": {
          "type": "object",
          "properties": {
            "given_name": {
              "type": "string",
              "example": "Juan Diego"
            },
            "surname": {
              "type": "string",
              "example": "Oliva"
            }
          }
        },
        "deposits_payer": {
          "type": "object",
          "properties": {
            "addres": {
              "type": "string"
            },
            "email_address": {
              "type": "string",
              "example": "test@alcancia.com"
            },
            "name": {
              "$ref": "#/components/schemas/deposits_payer_name"
            }
          }
        }
      },
      "securitySchemes": {
        "BearerAuth": {
          "type": "http",
          "scheme": "bearer"
        }
      },
    },
    
  },

  "apis":['./routes/*.js'],
}