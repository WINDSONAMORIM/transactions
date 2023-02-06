import { Transaction } from "./transaction";
import {v4 as uuid} from "uuid";

interface UserDTO{
    name: string;
    cpf: string;
    email: string;
    age: number;
}

export class User{
    private id: string;
    private name: string;
    private cpf: string;
    private email: string;
    private age: number;
    transactions: Array<Transaction>;

    constructor(params:UserDTO){
        this.id = uuid();
        this.name = params.name;
        this.cpf = params.cpf;
        this.email = params.email;
        this.age = params.age;
        this.transactions = [];        
    }

    get getId(){
        return this.id;
    }

    get getName(){
        return this.name;
    }

    get getCpf(){
        return this.cpf
    }

    get getEmail(){
        return this.email;
    }

    get getAge(){
        return this.age;
    }

    getUser(){
        return{
            id: this.id,
            name: this.name,
            cpf: this.cpf,
            email: this.email,
            age: this.age,
            transactions: this.transactions,
        }
    }

    
    getUserNotTransactions(){
        return{
            id: this.id,
            name: this.name,
            cpf: this.cpf,
            email: this.email,
            age: this.age,
        }
    }

}