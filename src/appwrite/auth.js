import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

//  Everything will be in the a class

export class AuthService {
    client = new Client();
    account;

//  constructor is the method everytime will run where this class will be called
    constructor() {
        this.client
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId);

//?    account tb bne ga jb CLIENT hoga
        this.account = new Account(this.client);
    }

    //?   *account* aagya iss ki basis pe hum saare methods lga skte hain
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);

            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
            try {
                return await this.account.get();
            } catch (error) {
                console.log("Appwrite service :: getCurrentUser :: error ", error);
            }

            return null;
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error ", error);
        }
    }
}

const authService = new AuthService();

export default authService;
