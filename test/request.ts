import { HttpRequestParser } from '../src/index';
import { suite, test } from 'mocha-typescript';
import * as assert from 'assert';

@suite('Request Tests')
class Request {

    @test('parse GET request')
    test() {
        const parser = new HttpRequestParser();
        const request = parser.parseHttpRequest('https://api.github.com', null, false);

        assert.deepEqual(request, {
            method: 'GET',
            url: 'https://api.github.com',
            headers: undefined,
            body: null,
            rawBody: ''
        });
    }

}