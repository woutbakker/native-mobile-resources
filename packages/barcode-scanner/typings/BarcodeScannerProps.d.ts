/**
 * This file was generated from BarcodeScanner.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Team
 */
import { ActionValue, EditableValue } from "@mendix/pluggable-widgets-api/properties";

interface CommonProps<Style> {
    style: Style[];
}

export interface BarcodeScannerProps<Style> extends CommonProps<Style> {
    barcode: EditableValue<string>;
    onDetect?: ActionValue;
}
