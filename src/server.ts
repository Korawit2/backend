import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import { autoroutes } from "elysia-autoroutes";
import { getAllUser, getIdUser, createUser, duplecateUser, checkUser, updateUser
        ,createOrg, getAllOrg, editOrg, createEvent, getAllEvent, eventFilter} from "./model";
import { jwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie'
import { cors } from "@elysiajs/cors";
const prisma = new PrismaClient()

const app = new Elysia()
.use(cors({
  credentials: true,
}))
.use(cookie())
.use(
  jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET as string
  })
)
.derive(async ({jwt, cookie, headers}) => {
  const auth = headers.authorization
  if(auth) {
    const convert = auth.startsWith('Bearer ') ? auth.slice(7) : null
    const profile = await jwt.verify(convert!)
    return { profile }
  } else {
  return false
  }
  
})
.get("/", () => "server Runx is running ")
.get("/getCookie", async({ jwt, cookie }) => {
  console.log(cookie)
  return {
    status: false
  }
})
/////////////////////////////////////////////////////guard///////////////////////////////////////////////
.guard({
  beforeHandle: ({set,profile}) =>{
    if (!profile) {
      set.status = 401
      return 'Unauthorized'
    }
  }
}, (app) =>
      app
        .get("/all", () => getAllUser())
        .get("/user/:id", ({params}) => {
          const id = parseInt(params.id)
          const res = getIdUser(id)
          return res
        })
        .delete("/del/:id", ({params}) => {
          return prisma.userRunx.delete({
            where: {id: Number(params.id)}
          })
        })
        ////////////////////////////////////////////Edit user//////////////////////////////////////////////////////////
        .post("/edit/user/:id", async ({body,params, set})=> {
          try {
            const userBody = body
            console.log(params)
            console.log("----")
            const userId: number = parseInt(params.id)
            console.log(userId)
            const res = await updateUser(userBody, userId)
            if (res.status == "ok") {
              return {message: "Edit successful"}
            }
          } catch (error) {
            set.status = 500
            return {
                message: 'error',
                error        
            }
          }
          
        },{
          body: t.Object({
            dateofBirth: t.String(),
            firstName: t.String(),
            lastName: t.String(),
            gender: t.String(),
            idNumber: t.String(),
            nationality: t.String(),
            selectedNationality: t.String(),
            telephone: t.String(),
              //email: t.Optional(t.String())
        
          })
        })
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
        //////////////////////////////////////////////////////Events////////////////////////////////////////////////

        .get("/events", ()=> getAllEvent())

        .post("/events", async ({body, set})=> {
          const eventBody = body
          try {
            const eventBody = body
            const res = await createEvent(body)
            if (!res) {
              return { message: "insert fail"}
            }
            return { message: "insert complete "}
          } catch (error) {
            set.status = 500
            return {
                message: 'error',
                error        
            }
          }
        },{
          body: t.Object({
            title: t.String(),
            location: t.String(),
            Organization_id: t.Number()
          })
        })

        .post("/events/filter", async ({body, set})=>{
          try {
            const event = await eventFilter(body)
            set.status = 200
            return {
              status: 200,
              data: event
            }
          } catch (error){
            set.status = 400
            return {
                message: 'error',
                error        
            }
          }
          
        },{
          body: t.Object({
            location: t.Optional(t.String())
          })
        })
        //////////////////////////////////////////////////////////////////////////////////////////////////
        
)
////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////sing up//////////////////////////////
.post("/signup", async ({body, set}) => {
  const userBody: any = body
  if (userBody.password != userBody.confirmpassword) {
    set.status = 400
    return { message: "confirm password is not the same"}
  }
  userBody.password = await Bun.password.hash(userBody.password, {
    algorithm: 'bcrypt',
    cost: 10,
  })
  const alreadyUser = await duplecateUser(userBody.email)
  if (!alreadyUser) {
    const res = await createUser({
      firstname: userBody.firstname,
      lastname: userBody.lastname,
      email: userBody.email,
      password: userBody.password,
      con_password: userBody.confirmpassword,
      policy_agreement: userBody.policy_agreement
    })
    if (res.status === 'error') {
      set.status = 400
      return {
        message: 'insert incomplete'
      }
    }
    return { message: 'ok'}
  }
  return { message: "This email already exit"}
},{
  body: t.Object({
    firstname: t.String(),
    lastname: t.String(),
    email: t.String(),
    password: t.String(),
    confirmpassword: t.String(),
    policy_agreement: t.Boolean()
  }),
})
///////////////////////////////////////////guard////////////////////////////////////////////////////////


/////////////////////////////////////////////////sing in/////////////////////////////////////////////////

.post("/login", async ({body, set, jwt, cookie, setCookie}) => {
  try {
    const userData: any = body
    const res = await checkUser({userData})
    if (!res.loggedIn) {
      set.status = 500
      return {
        status: false,
      }
    }
    setCookie('authToken', await jwt.sign({
      email: userData.email
    }), {
      httpOnly: true,
      maxAge: 7 * 86400,
    })

    console.log(cookie)

    return {
      status: true,
      token: cookie.authToken,
      userr: { "userid": res.query?.id,
                "firstname": res.query?.firstname
      }
    }
  } catch (error) {
    set.status = 500
    return {
        message: 'error',
        error        
    }
  }
},{
  body: t.Object({
    email: t.String(),
    password: t.String(),
  })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////Organization///////////////////////////////////


.get("/org", () => getAllOrg())

.post("/org", ({body, set})=> {
  const orgBody = body
  try {
    const res = createOrg(orgBody)
    return {
      message: "insert complete",
      orgBody
    }
  } catch (error) {
    set.status = 500
    return {
        message: 'error',
        error        
    }
  }
})

.put("/org/:id", async ({body,params, set})=> {
  try {
    const orgBody = body
    const Id: number = parseInt(params.id)
    const res = editOrg(orgBody, Id)
    return {
        message: "Edit complete",
        orgBody
    }
  } catch (error) {
    set.status = 500
    return {
        message: 'error',
        error        
    }
  }
  
})



/////////////////////////////////////////////////////////////////////////////////////////////////////////

.listen(3000);

export type App = typeof app
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


