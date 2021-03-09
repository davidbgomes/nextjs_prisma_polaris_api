import express from "express";
const app = express();
const port = 8080; // default port to listen
import jwt from "jsonwebtoken"
import { PrismaClient } from '@prisma/client'
import cors from "cors"
app.use(express.json())
app.use(cors())
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

app.get("/", async( _req, _res ) => {
	const hashedPassword = await bcrypt.hash("password1234", 10)

	console.log(hashedPassword)
})


app.get("/orders", async( _req, _res ) => {
    const allProducts = await prisma.orders.findMany()
	_res.json(allProducts)
})

app.post("/orders", async( _req, _res ) => {

	console.log("_req.body:", _req.body.customers.firstName)

	try{
		const customers = await prisma.customers.create({
		    data: {
		      	first_name: _req.body.customers.firstName,
		      	last_name: _req.body.customers.lastName,
		      	email: _req.body.customers.email,
		      	gender: _req.body.customers.gender,
		    },
	  	})

	  	const orders = await prisma.orders.create({
		    data: {
		      	customers: {
		        	connect: { id: customers.id },
		      	},
		    },
	  	})

	  	const products = _req.body.products

	  	for(let i = 0; i< products.length; i++){
		  	await prisma.orders_products.create({
			    data: {
			      	orders: {
			        	connect: { id: orders.id },
			      	},
			      	products: {
			        	connect: { id: products[i].id },
			      	},
			    },
		  	})
	  	}
	  	_res.send("success")
	}
	catch{
		_res.status(500).send()
	}

})

app.get("/products", async( _req, _res ) => {
	const allProducts = await prisma.products.findMany()
	console.log(allProducts)
	_res.json(allProducts)
})

app.get("/customers", async( _req, _res ) => {
	const allCustomers = await prisma.customers.findMany()
	console.log(allCustomers)
	_res.json(allCustomers)
})

app.post("/auth", async( _req, _res ) => {
	const user = await prisma.users.findUnique({
	  	where: {
	    	email: _req.body.email,
	  	},
	})

	if (user == null) {
	    return _res.status(400).send('Cannot find user')
	}
	try {
	    if(await bcrypt.compare(_req.body.password, user.password)) {
	    	console.log("success")
	    	var token = await jwt.sign(user, 'abcd');
  			_res.json({token: token})
	    } else {
	      _res.sendStatus(403)
	    }
	}
	catch {
	    _res.status(500).send()
	}
})

app.get("/orders/:id",authenticateToken, async( _req, _res ) => {
	const id = _req.params.id

	const allOrderProducts = await prisma.orders_products.findMany({
		where:{
			order_id:parseInt(id,10),
		},
		include:{
			products:true,
			orders:{
				include:{
					customers:true,
				},
			},
		},
  	})

	console.log("allOrderProducts", allOrderProducts)

    _res.json(allOrderProducts);
})

// start the express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
})


function authenticateToken(_req, _res, _next) {
  	const authHeader = _req.headers['authorization']
  	const token = authHeader && authHeader.split(' ')[1]
  	console.log("authHeader", authHeader)
  	console.log("token", token)
  	if (token == null) return _res.sendStatus(401)

  	try{
  		jwt.verify(token, 'abcd')
    	_next()
  	}
  	catch(err){
  		console.log("error:", err)
  		_res.sendStatus(403) 
  	}
}

export default app