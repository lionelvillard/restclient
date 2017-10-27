import { HostCertificate } from '../models/hostCertificate';

export interface IRestClientSettings {
    followRedirect: boolean;
    defaultUserAgent: string;
    timeoutInMilliseconds: number;
    showResponseInDifferentTab: boolean;
    proxy: string;
    proxyStrictSSL: boolean;
    rememberCookiesForSubsequentRequests: boolean;
    enableTelemetry: boolean;
    excludeHostsForProxy: string[];
    environmentVariables: Map<string, Map<string, string>>;
    mimeAndFileExtensionMapping: Map<string, string>;
    includeAdditionalInfoInResponse: boolean;
    hostCertificates: Map<string, HostCertificate>;
    useTrunkedTransferEncodingForSendingFileContent: boolean;
    suppressResponseBodyContentTypeValidationWarning: boolean;
}

export class RestClientSettings implements IRestClientSettings {
    public followRedirect: boolean;
    public defaultUserAgent: string;
    public timeoutInMilliseconds: number;
    public showResponseInDifferentTab: boolean;
    public proxy: string;
    public proxyStrictSSL: boolean;
    public rememberCookiesForSubsequentRequests: boolean;
    public enableTelemetry: boolean;
    public excludeHostsForProxy: string[];
    public environmentVariables: Map<string, Map<string, string>>;
    public mimeAndFileExtensionMapping: Map<string, string>;
    public includeAdditionalInfoInResponse: boolean;
    public hostCertificates: Map<string, HostCertificate>;
    public useTrunkedTransferEncodingForSendingFileContent: boolean;
    public suppressResponseBodyContentTypeValidationWarning: boolean;


    public constructor() {
        this.initializeSettings();
    }

    private initializeSettings() {
        this.followRedirect = true;
        this.defaultUserAgent = "restclient";
        this.showResponseInDifferentTab = false;
        this.rememberCookiesForSubsequentRequests = true;
        this.timeoutInMilliseconds = 0;
        this.excludeHostsForProxy = [];

        this.environmentVariables = new Map<string, Map<string, string>>();
        this.mimeAndFileExtensionMapping = new Map<string, string>();

        this.includeAdditionalInfoInResponse = false;
        this.hostCertificates = new Map<string, HostCertificate>();
        this.useTrunkedTransferEncodingForSendingFileContent = true;
        this.suppressResponseBodyContentTypeValidationWarning = false;

        this.proxyStrictSSL = false;
        this.enableTelemetry = true;
    }

}
