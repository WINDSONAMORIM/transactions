import express, { Request, Response } from 'express';
import { Transaction, User } from './classes';
import { CPFCadastrado } from './middlewares';
import { userExist } from './middlewares/userExist';

const app =  express();

app.use (express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (request: Request, response: Response) => {
	return response.json('OK');
});

app.listen(8080, () => console.log('Servidor iniciado'));

export const listUsers: Array<User> = [];

app.post('/users',CPFCadastrado,(request: Request, response: Response)=>{
	const {name, cpf, email, age} = request.body;
	const newCPF = cpf.replace(/[^a-zA-Z0-9]/g, '');

	const newUser = new User({name, cpf: newCPF, email, age})
	listUsers.push(newUser);
	return response.status(200).json({body: newUser.getUser(),message: 'User Created sucessfull'});
})

app.get('/users/:userId', (request: Request, response: Response)=>{
	const {userId} = request.params

	const userSearched =  listUsers.find((user) => user.getId === userId) as User;

	return response.status(200).json({user: userSearched.getUserNotTransactions()})
})

app.get('/users', (request: Request, response: Response) => {
	const { name, email, cpf } = request.query 	
  
	const users = listUsers.filter((user) => {
	  if(name && email && cpf) {
		return (
		  user.getName.includes(name as string) &&
		  user.getCpf.includes(cpf as string) &&
		  user.getEmail.includes(email as string)
		); 
	  }
  
	  if (name || email || cpf) {
		return (
		  user.getName.includes(name as string) ||
		  user.getCpf.includes(cpf as string) ||
		  user.getEmail.includes(email as string)
		);
	  }
  
	  return user
	})
	  
	  return response
	  .status(201)
	  .json({ users: users.map((user) => user.getUserNotTransactions()) , message: 'its list, bro' });
  
})

app.put('/users/:userId',userExist, (request: Request, response: Response) => {
	const { userId } = request.params;
	const {name, cpf, email, age} = request.body;
	const newCPF = cpf.replace(/[^a-zA-Z0-9]/g, '');

	const newUser = new User({name, cpf: newCPF, email, age})

	const index = listUsers.findIndex((user) => user.getId === userId)
	listUsers[index] = newUser;

	return response.status(200).json({message:'Usuario Alterado'});
})  

app.delete('/users/:userId',userExist, (request: Request, response: Response) => {
	const { userId } = request.params;

	listUsers.splice(listUsers.findIndex((user) => user.getId === userId),1);
	return response.status(200).json({message:'Usuario Deletetado'});
})

app.post('/users/:userId/transactions',userExist, (request: Request, response: Response) => {
	const { userId } = request.params;
	const {title, value, type} = request.body;

	const transactions = new Transaction({title, value, type}) 

	const index = listUsers.findIndex((user) => user.getId === userId)
	listUsers[index].transactions.push(transactions);
	return response.status(200).json({body: listUsers[index].getUser(),message:'Transação inserida com sucesso'});
})

app.get('/users/:userId/transactions',userExist, (request: Request, response: Response)=>{
	const {userId} = request.params
	const {title, type} = request.query;

	const user =  listUsers.find((user) => user.getId === userId) as User;
	const income = user.transactions.filter((type) => type.getType === 'income');
	const totIncome = income.map((transactions)=>transactions.getValue).reduce((accumulator, next) => accumulator + next);

	const outcome = user.transactions.filter((type) => type.getType === 'outcome');
	const totOutcome = outcome.map((transactions)=>transactions.getValue).reduce((accumulator, next) => accumulator + next);

	console.log(totIncome);
	console.log(totOutcome);

	/*const transactionFilter = user.transactions.filter((tra) => {
		if(title && type) {
		  return (
			transactionFilter.getTitle.includes(title as string) &&
			transactionFilter.getType.includes(type as string)
		  ); 
		}
	
		if (title || type) {
		  return (
			transactionFilter.getTitle.includes(title as string) &&
			transactionFilter.getType.includes(type as string)
		  );
		}
	
		return transactionFilter
	})*/

	return response.status(200)
	.json({user: user.getUser(), 
	message:`Total income: ${totIncome}, Total outcome: ${totOutcome}, saldo: ${totIncome-totOutcome}`})
})

app.get('/users/:userId/transactions/:idTransactions',userExist, (request: Request, response: Response)=>{
	const {userId, idTransactions} = request.params

	const index =  listUsers.findIndex((user) => user.getId === userId);
	const transactionsSearched =  listUsers[index].transactions.find((transaction) => transaction.getId === idTransactions) as Transaction;

	return response.status(200).json({user: transactionsSearched.getTransactions(), message:'Transação buscada'})
})

app.put('/users/:userId/transactions/:idTransactions',userExist, (request: Request, response: Response) => {
	const { userId, idTransactions } = request.params;
	const {title, value, type} = request.body;

	const newTransactions = new Transaction({title, value, type}) 

	const index = listUsers.findIndex((user) => user.getId === userId)
	const indexTransactions = listUsers[index].transactions.findIndex((transaction) => transaction.getId === idTransactions)

	listUsers[index].transactions[indexTransactions] = newTransactions;

	return response.status(200).json({message:'Transaction Alterado'});
})  

app.delete('/users/:userId/transactions/:idTransactions',userExist, (request: Request, response: Response) => {
	const { userId, idTransactions } = request.params;

	const index = listUsers.findIndex((user) => user.getId === userId)

	listUsers[index].transactions.splice(listUsers[index].transactions.findIndex((transaction) => transaction.getId === idTransactions),1);
	return response.status(200).json({message:'Usuario Deletetado'});
})