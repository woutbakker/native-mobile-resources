import { dynamicValue } from "@native-mobile-resources/util-widgets/test";
import { createElement } from "react";
import { render } from "react-native-testing-library";

import { Props, QRCode } from "../QRCode";

describe("QRCode", () => {
    let defaultProps: Props;

    beforeEach(() => {
        defaultProps = {
            style: [],
            value: dynamicValue("Hello, world!")
        };
    });

    it("renders a qr code", () => {
        const component = render(<QRCode {...defaultProps} />);
        expect(component.toJSON()).toMatchSnapshot();
    });

    it("renders an empty container when there is no value", () => {
        const component = render(<QRCode {...defaultProps} value={dynamicValue()} />);
        expect(component.toJSON()).toMatchSnapshot();
    });
});
