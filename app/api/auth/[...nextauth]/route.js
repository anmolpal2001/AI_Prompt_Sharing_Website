import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
// import GithubProvider from "next-auth/providers/github";
import { connectDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
    providers : [
        // GithubProvider({
        //   clientId: process.env.GITHUB_CLIENT_ID,
        //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
        // }),
        GoogleProvider({  
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
      ],
      callbacks : {
        async session({ session}) {
          const sessionUser = await User.findOne({email : session.user.email});
          session.user.id = sessionUser._id.toString();
          return session;
        },
        async signIn({profile}){
          try{  
            await connectDB();
            // check if a user already exits
            const userExists = await User.findOne({email : profile.email});


            // if not, create a new user
            if(!userExists){
              await User.create({
                email : profile.email,
                username : profile.name.replace(" ","").toLowerCase(),
                image : profile.picture ? profile.picture : null,
              });
            }
            console.log(profile);

            return true;

          }catch(error){
            console.log("Error in sign in", error);
            return false;
          }
        },
      }
});

export {handler as GET, handler as POST};