const express = require('express');
const router = express.Router();

// Infra
// add-account-repository
const mongoose = require('mongoose');
const AccountModel = mongoose.model('Account');

class AddAccountRepository {
    async signUp(email, password) {
        const user = await AccountModel.create({ email, password });

        return user;
    };  
};

// Domain
// signup-useCase
class SignUpUseCase {
    async signUp(email, password, repeatPassword) {
        if(password === repeatPassword) {
            new AddAccountRepository().add(email, password);
        };
    };
};

// Presentation
// signup-router
class SignUpRouter {
    async route(httpRequest) {
        const { email, password, repeatPassword } = httpRequest.body;

        const user = new SignUpUseCase().signUp(email, password, repeatPassword);

        return {
            statusCode: 200,
            body: user,
        };

        response.status(400).json({ error: 'password must be equal to repeatPassword' });
    };
};

class ExpressRouterAdapter {
    static adapt(router) {
        return async (request, response) => {
            const httpRequest = {
                body: request.body,
            };

            const httpResponse = await router.route(httpRequest);

            response.status(httpResponse.statusCode).json(httpResponse.body);
        };
    };
};

module.exports = () => {
    const router = new SignUpRouter();

    router.post('/signup', ExpressRouterAdapter.adapt(router));
};