import { HostService } from '@host';
import { Injectable } from '@nestjs/common';
import { CmsHttpsClientService } from '../cms-https-client/cms-https-client.service';
import { BaseCmsRequest, BaseCmsResponse, GetBrokersInfoResponse, HostInfo, HandleBrokerRequest } from '../type';
import { HandleHostErrors } from '@common';
import { HandleCmsHttpsClientErrors } from '@common/decorators';
import { BrokerError } from '@error/broker/broker-error';
import { CmsError } from '@error/cms/cms-error';

/**
 * Service for managing broker operations.
 *
 * Provides high-level business logic for broker-related operations
 * including message handling and service coordination.
 *
 * @category Business Services
 * @since 1.0.0
 */
@Injectable()
export class BrokerService {
    constructor(
        private readonly hostService : HostService,
        private readonly cmsClient : CmsHttpsClientService,
    ){}

    @HandleHostErrors()
    @HandleCmsHttpsClientErrors()
    async getBrokers(userId: string, hostUid : string){
        const host : Omit<HostInfo, "password"> = await this.hostService.findHost(userId, hostUid);
        const url = `https://${host.address}:${host.port}/cm_api`
        const body : BaseCmsRequest = {
            task : "getbrokersinfo",
            token : host.token ? host.token : ""
        }
        const response = await this.cmsClient.postAuthenticated<BaseCmsRequest, GetBrokersInfoResponse>(url, body);
        if(response.status !== 'success'){
            throw BrokerError.GetBrokersFailed();
        }
        return response.brokersinfo;
        
    }

    
    @HandleHostErrors()
    @HandleCmsHttpsClientErrors()
    async stopBroker(userId: string, hostUid: string, bname : string) : Promise<BaseCmsResponse>{
        const host : Omit<HostInfo, "password"> = await this.hostService.findHost(userId, hostUid);
        const url = `https://${host.address}:${host.port}/cm_api`
        const body : HandleBrokerRequest = {
            task : "broker_stop",
            token : host.token ? host.token : "",
            bname : bname
        }

        const response = await this.cmsClient.postAuthenticated<HandleBrokerRequest, BaseCmsResponse>(url, body);
        if(response.status !== 'success'){
            throw BrokerError.BrokerStopFailed();
        }
        return response;

    }

    @HandleHostErrors()
    @HandleCmsHttpsClientErrors()
    async startBroker(userId: string, hostUid: string, bname : string): Promise<BaseCmsResponse>{
        const host : Omit<HostInfo, "password"> = await this.hostService.findHost(userId, hostUid);
        const url = `https://${host.address}:${host.port}/cm_api`
        const body : HandleBrokerRequest = {
            task : "broker_start",
            token : host.token ? host.token : "",
            bname : bname
        }

        const response = await this.cmsClient.postAuthenticated<HandleBrokerRequest, BaseCmsResponse>(url, body);
        if(response.status !== 'success'){
            throw BrokerError.BrokerStartFailed();
        }
        return response;

    }


    @HandleHostErrors()
    @HandleCmsHttpsClientErrors()
    async restartBroker(userId: string, hostUid: string, bname : string) : Promise<boolean> {
        const host : Omit<HostInfo, "password"> = await this.hostService.findHost(userId, hostUid);
        const url = `https://${host.address}:${host.port}/cm_api`
        const stopRequest : HandleBrokerRequest = {
            task : "broker_stop",
            token : host.token ? host.token : "",
            bname : bname
        }

        const response = await this.cmsClient.postAuthenticated<HandleBrokerRequest, BaseCmsResponse>(url, stopRequest);
        if(response.status === "success"){
            const startRequest : HandleBrokerRequest = {
                task : "broker_start",
                token : host.token ? host.token : "",
                bname : bname
            }

            const response = await this.cmsClient.postAuthenticated<HandleBrokerRequest, BaseCmsResponse>(url, startRequest);
            if(response.status === "success"){
                return true;
            }
            else{
                throw BrokerError.BrokerStartFailed();
            }
        }   
        else{
            throw BrokerError.BrokerStopFailed();
        }
    }

}
