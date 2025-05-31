// Import or define the Soba type before using it
// Example import (uncomment and adjust the path if Soba is defined elsewhere):
// import { Soba } from './soba';

type Soba = object;

export type tipSobe = {
    id: number;
    kapacitet: number;
    ime: string
    cijena: number;
    soba: Soba[]
};

export default function tipSobe() { }