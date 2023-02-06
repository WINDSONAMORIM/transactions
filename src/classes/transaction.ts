import {v4 as uuid} from "uuid";

interface TransactionDTO{
    title: string;
    value: number;
    type: 'income'|'outcome';
}

export class Transaction{
    private id: string;
    private title: string;
    private value: number;
    private type: 'income'|'outcome';

    constructor(params: TransactionDTO){
        this.id = uuid();
        this.title = params.title;
        this.value = params.value;
        this.type = params.type;
    }

    get getId(){
        return this.id;
    }

    get getTitle(){
        return this.title;
    }

    get getValue(){
        return this.value
    }

    get getType(){
        return this.type
    }

    getTransactions(){
        return{
            id: this.id,
            title: this.title,
            value: this.value,
            type: this.type 
        }
    }

}