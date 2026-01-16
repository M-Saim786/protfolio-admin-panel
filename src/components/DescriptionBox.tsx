"use client";

import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
// import { Label } from "@/components/ui/label";

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

import "react-quill/dist/quill.snow.css"; // Keep this normal import (CSS is fine on server)
import { Label } from "./ui/label";


type Props = {
    value: string;
    handleInputChange: (value: any) => void;
    loading?: boolean;
};

export default function DescriptionEditor({ value, handleInputChange, loading }: Props) {
    // const modules = {
    //     toolbar: [
    //         [{ header: [1, 2, 3, false] }],
    //         ["bold", "italic", "underline", "strike"],
    //         [{ list: "ordered" }, { list: "bullet" }],
    //         ["blockquote", "code-block"],
    //         ["link", "image", "video"],
    //         [{ align: [] }],
    //         ["clean"],
    //     ],
    // };

    const modules = {
        toolbar: [
            [{ font: [] }, { size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3,  false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            [{ direction: "rtl" }],
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            ["clean"],
        ],
    };


    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "blockquote",
        "code-block",
        "link",
        "image",
        "video",
        "align",
    ];

    return (
        <div className="space-y-2">
            {/* <Label htmlFor="description">Description(*)</Label> */}
            <div className="">
                <ReactQuill
                    id="description"
                    theme="snow"
                    value={value}
                    onChange={(content) => handleInputChange(content)}
                    modules={modules}
                    formats={formats}
                    readOnly={loading}
                // className="h-[40%]" // Tailwind height class

                // style={{ height: "40%" }} // set desired height here

                />
            </div>
        </div>
    );
}
