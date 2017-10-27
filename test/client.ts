import { HttpRequestParser, HttpClient } from '../src/index';
import { suite, test } from 'mocha-typescript';
import * as assert from 'assert';

@suite('Request Tests')
class Request {

    @test('send GET request')
    async test() {
        const parser = new HttpRequestParser();
        const client = new HttpClient(null);

        const request = parser.parseHttpRequest('https://api.github.com', null, false);
        const response = await client.send(request);
        assert.ok(response);
        assert.equal(response.headers.Server, 'GitHub.com');
    }

}