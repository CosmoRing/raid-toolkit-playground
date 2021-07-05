import { Injectable } from '@angular/core';
import {
    assertApiError,
    AuthorizationRejectedError,
    handleResponse,
    InvalidApplicationCredentialsError,
    isErrorType,
    OAuthAuthorizationRequest,
    ScopeNotGrantedError
} from '@raid-toolkit/app-shared';
import { Client, StorageFunctions } from '@raid-toolkit/client';
// import Cryptr from "cryptr";
import { BehaviorSubject, from, Observable } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class ClientService {

    /**
    * in order for the client to be able to reconnect without requesting the user to grant
    * permissions again, both storage and crypt implementations must be provided
    */
    private storage: StorageFunctions = {
        async fetch(key) {
            return localStorage.getItem(key) as any;
        },
        async store(key, data: any) {
            return localStorage.setItem(key, data);
        }
    };

    /**
     * cryptr already implements the required contract (encrypt/decrypt)
     */
    // private crypt = new Cryptr("foo");

    private clientManifest: OAuthAuthorizationRequest = {
        appId: 'rsl-dashboard',
        name: 'RSL Dashboard',
        description: 'Dashboard for RSL',
        scopes: {
            'read:heroes': 'Read hero data',
            'read:artifacts': 'Read artifact data',
        },
        author: 'cosmoringhub@gmail.com',
    };

    private client = new Client(this.clientManifest, { storage: this.storage });

    public refreshSubject = new BehaviorSubject<null>(null);

    constructor() {
        this.updateTokenManager();
     }

    public getConnectedClient(): Observable<Client> {
        const _this = this;
        return from((async function () {
            await _this.client.requestAccess();
            try {
                // make sure we can get a token
                await _this.client.authorize();
            } catch (e) {
                // don't try to handle unknown errors:
                assertApiError(e);

                // if our token was not granted due to out of date credentials, or missing scopes (maybe we added one since the user granted access?)
                if (
                    isErrorType(e, AuthorizationRejectedError) ||
                    isErrorType(e, InvalidApplicationCredentialsError) ||
                    isErrorType(e, ScopeNotGrantedError)
                ) {
                    // re-request access, and force it to hit the service this time (user will be prompted)
                    // !doing this will invalidate any previous access and tokens granted!
                    await _this.client.requestAccess(/* force */ true);
                } else {
                    throw e;
                }
            }
            return _this.client;
        }).bind(this)()).pipe(
            switchMap(client => this.refreshSubject.pipe(mapTo(client)))
        );
    }

    private updateTokenManager(): void {
        
        // client override
        const tokenManager = this.client['tokenManager'];

        if (tokenManager) {
            tokenManager['requestAccess'] = 
            async function(force: any) {
                const { storage, fetch, baseUrl } = this.opts;
                if (!force && storage) {
                    try {
                        const buf = await storage.fetch('grant');
                        if (buf) {
                            this.grant.setValue(JSON.parse(buf));
                            return;
                        }
                    }
                    catch (_a) {
                        // do nothing
                    }
                }
                const response = await fetch(`${baseUrl}/oauth/authorize`, {
                    method: 'POST',
                    body: JSON.stringify(this.request),
                    headers: {
                        // @ts-ignore for some reason this header isn't included in the list
                        'Content-Type': 'application/json',
                    },
                });
                const grant = await handleResponse(response.status, response.json());
                if (storage) {
                    try {
                        const buf = JSON.stringify(grant);
                        await storage.store('grant', buf);
                    }
                    catch (_b) {
                        // do nothing
                    }
                }
                this.grant.setValue(grant);
            }

            tokenManager['refreshToken'] = 
            async function() {
                this.authToken = new this.authToken.constructor()
                const grant = await this.grant;
                const tokenResponse = await this.opts.fetch(`${this.opts.baseUrl}/oauth/token`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        // @ts-ignore for some reason this header isn't included in the list
                        'Content-Type': 'application/x-www-form-urlencoded',
                        authorization: `Basic ${btoa(`${grant.appId}:${grant.secret}`)}`,
                    },
                    body: encodeURI(`scope=${grant.scopes.join(' ')}`),
                });
                const token: any = await handleResponse(tokenResponse.status, tokenResponse.json());
                this.tokenExpiry = new Date().valueOf() + token.expires_in;
                this.authToken.setValue(token);
                return this.authToken;
            }
        }

    }

}