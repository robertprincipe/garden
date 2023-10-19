import { Quill } from "react-quill";
const BaseImageFormat = Quill.import("formats/image");

const ImageFormatAttributesList = ["alt", "height", "width", "style"];

export class ImageFormat extends BaseImageFormat {
    static formats(domNode: any) {
        return ImageFormatAttributesList.reduce((formats: any, attribute: any) => {
            if (domNode.hasAttribute(attribute)) {
                // eslint-disable-next-line no-param-reassign
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, {});
    }

    format(name: string, value: string) {
        if (ImageFormatAttributesList.indexOf(name) > -1) {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}