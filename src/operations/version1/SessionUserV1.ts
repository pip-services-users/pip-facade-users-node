export class SessionUserV1 {
    /* Identification */
    public id: string;
    public login: string;
    public name: string;
    public create_time: Date;

    /* User information */
    public time_zone: string;
    public language: string;
    public theme: string;
    public roles: string[];

    /* Custom fields */
    public custom_hdr: any;
    public custom_dat: any;
}