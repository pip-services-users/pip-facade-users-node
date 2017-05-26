export class SessionUserV1 {
    /* Identification */
    public id: string;
    public login: string;
    public name: string;
    public create_time: Date;

    /* Security info **/
    public roles: string[];
    public change_pwd_time: Date;

    /* User information */
    public time_zone: string;
    public language: string;
    public theme: string;

    /* Custom fields */
    public custom_hdr: any;
    public custom_dat: any;
}