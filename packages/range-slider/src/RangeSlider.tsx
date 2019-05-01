import { EditableValue, ValueStatus } from "@mendix/pluggable-widgets-api/properties";
import { flattenStyles } from "@native-mobile-resources/util-widgets";
import MultiSlider, { MarkerProps } from "@ptomasroos/react-native-multi-slider";
import { Component, createElement } from "react";
import { LayoutChangeEvent, View } from "react-native";

import { RangeSliderProps } from "../typings/RangeSliderProps";
import { Marker } from "./Marker";
import { defaultRangeSliderStyle, RangeSliderStyle, State } from "./ui/Styles";

export type Props = RangeSliderProps<RangeSliderStyle>;

export class RangeSlider extends Component<Props, State> {
    readonly state: State = {};

    private readonly onLayoutHandler = this.onLayout.bind(this);
    private readonly onSlideHandler = this.onSlide.bind(this);
    private readonly onChangeHandler = this.onChange.bind(this);
    private readonly styles = flattenStyles(defaultRangeSliderStyle, this.props.style);

    private lastLowerValue = Number(this.props.lowerValueAttribute.value);
    private lastUpperValue = Number(this.props.upperValueAttribute.value);

    render(): JSX.Element {
        const enabledOne = this.isEnabled(this.props.lowerValueAttribute);
        const enabledTwo = this.isEnabled(this.props.upperValueAttribute);
        const min = Number(this.props.minimumValue.value);
        const max = Number(this.props.maximumValue.value);
        const step =
            this.props.stepSize.value && this.props.stepSize.value.gt(0) ? Number(this.props.stepSize.value) : 1;

        const customMarker = (enabled: boolean) => (props: MarkerProps) => (
            <Marker {...props} markerStyle={enabled ? props.markerStyle : this.styles.markerDisabled} />
        );

        const hasError = this.hasError(enabledOne, enabledTwo, min, max);
        const isValid = (enabledOne || enabledTwo) && !hasError;

        return (
            <View onLayout={this.onLayoutHandler} style={this.styles.container}>
                <MultiSlider
                    values={[
                        Number(this.props.lowerValueAttribute.value),
                        Number(this.props.upperValueAttribute.value)
                    ]}
                    min={min}
                    max={max}
                    step={step}
                    enabledOne={enabledOne && !hasError}
                    enabledTwo={enabledTwo && !hasError}
                    markerStyle={isValid ? this.styles.marker : this.styles.markerDisabled}
                    trackStyle={isValid ? this.styles.track : this.styles.trackDisabled}
                    selectedStyle={isValid ? this.styles.highlight : this.styles.highlightDisabled}
                    pressedMarkerStyle={this.styles.markerActive}
                    onValuesChange={this.onSlideHandler}
                    onValuesChangeFinish={this.onChangeHandler}
                    sliderLength={this.state.width}
                    isMarkersSeparated={true}
                    customMarkerLeft={customMarker(enabledOne && !hasError)}
                    customMarkerRight={customMarker(enabledTwo && !hasError)}
                />
            </View>
        );
    }

    private hasError(enabledOne: boolean, enabledTwo: boolean, min: number, max: number): boolean {
        if (enabledOne || enabledTwo) {
            if (min > max) {
                return true;
            } else {
                if (enabledTwo) {
                    const value = Number(this.props.lowerValueAttribute.value);
                    return min >= value && value <= max;
                }
                if (enabledTwo) {
                    const value = Number(this.props.upperValueAttribute.value);
                    return min >= value && value <= max;
                }
            }
        }
        return false;
    }

    private isEnabled(property: EditableValue<BigJs.Big>): boolean {
        return this.props.editable !== "never" && !property.readOnly;
    }

    private onLayout(event: LayoutChangeEvent): void {
        this.setState({
            width: event.nativeEvent.layout.width
        });
    }

    private onSlide(values: number[]): void {
        if (
            this.props.lowerValueAttribute.status === ValueStatus.Available &&
            this.props.upperValueAttribute.status === ValueStatus.Available
        ) {
            this.props.lowerValueAttribute.setTextValue(String(values[0]));
            this.props.upperValueAttribute.setTextValue(String(values[1]));
        }
    }

    private onChange(values: number[]): void {
        if (
            this.lastLowerValue != null &&
            this.lastLowerValue === values[0] &&
            this.lastUpperValue != null &&
            this.lastUpperValue === values[1]
        ) {
            return;
        }

        this.lastLowerValue = values[0];
        this.lastUpperValue = values[1];
        this.props.lowerValueAttribute.setTextValue(String(values[0]));
        this.props.upperValueAttribute.setTextValue(String(values[1]));

        if (this.props.onChange && this.props.onChange.canExecute) {
            this.props.onChange.execute();
        }
    }
}
