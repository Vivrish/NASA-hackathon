import type { JSX } from "react";

interface Props {
    message: string;
    onClick?: () => void;
}


export default function Alarm(props: Props): JSX.Element {
    return (
        <div onClick={props.onClick} className="p-4 bg-red-500 text-white rounded shadow-md my-0.5 mx-1.5" >
            <h2 className="text-lg font-bold mb-2">Alarm</h2>
            <p>{props.message}</p>
        </div>
    );
}