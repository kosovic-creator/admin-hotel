export type Sobe = {
    id: number;
    sobaBroj: number;
    slike: string[];
    status: string;
    tipSobe: {
        id: number;
        ime: string;
        cijena: number;
    kapacitet: number;
        // ...druga polja ako treba
    };
    cijena?: number; // ako koristiš soba.cijena direktno
};
export default function Sobe() {

}