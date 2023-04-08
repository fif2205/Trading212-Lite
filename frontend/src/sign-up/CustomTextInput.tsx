import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {StyleProp, View, ViewStyle, TextInput, Text, StyleSheet, TextStyle, Animated, Easing} from "react-native";

const containerHeight = 70;
const textInputHeight = 45;
const textInputFontSize = 17;

const labelFontSize = 12;
const labelFocusedMargin = -5;
const labelBlurredMargin = -20;
const labelAnimationBottomToTop = 1;
const labelAnimationTopToBottom = 0;

const accentColor = "#747980";

export function CustomTextInput(props: 
    {
      label: string,
      style?: StyleProp<ViewStyle>,
      textInputProps?: Omit<React.ComponentProps<typeof TextInput>, "onChangeText">,
      onChangeTextProp: (text: string) => void,
    })
{
    const labelAnimationValue = useRef(new Animated.Value(0)).current;
    const cancelLabelAnimation = useRef<(() => void) | undefined>(undefined);

    useEffect(() => 
        {
            return () =>
            {
                cancelLabelAnimation.current?.();
            }
        },
        []
    );

    const performLabelAnimation = useCallback((endValue: (0 | 1)) =>
        {
            const animation = Animated.timing(labelAnimationValue, 
                {
                    toValue: endValue,
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }
            );

            cancelLabelAnimation.current = animation.stop;

            animation.start();
        },
        []
    );

    const [isFocused, setIsFocused] = useState(false);
    const [text, setText] = useState("");
    
    const onFocus = useCallback(() =>
        {
            setIsFocused(true);
            performLabelAnimation(labelAnimationBottomToTop);
        },
        []
    );

    const onBlur = useCallback(() =>
        {
            setIsFocused(false);
            if (text.length === 0)
            {
                performLabelAnimation(labelAnimationTopToBottom);
            }
        },
        [text]
    );

    const onChangeText = useCallback((text: string) =>
        {
            props.onChangeTextProp(text);
            setText(text);
        },
        []
    );

    const containerStyle = useMemo((): StyleProp<ViewStyle> =>
        [
            {
                height: containerHeight,
                justifyContent: "flex-end",
            },
            props.style,
        ],
        []
    );

    const textInputStyle = useMemo(() => 
        ({
            height: textInputHeight,
            outlineStyle: "none",
            fontSize: textInputFontSize,
        }),
        []
    );

    const labelStyle = useMemo((): ((StyleProp<TextStyle>) | Animated.Animated) =>
        ({
            marginBottom: labelAnimationValue.interpolate(
                {
                    inputRange: [0, 1],
                    outputRange: [labelBlurredMargin, labelFocusedMargin],
                }
            ),
            color: accentColor,
            fontSize: labelFontSize,
        }),
        []
    );

    const blackLineStyle = useMemo(() =>
        ({
            backgroundColor: accentColor,
            height: StyleSheet.hairlineWidth,
        }),
        []
    );

    return (
        <View style={containerStyle}>
            <Animated.Text style={labelStyle}>{props.label}</Animated.Text>

            <TextInput
                {...props.textInputProps}
                style={textInputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChangeText}
            />

            <View style={blackLineStyle} />
        </View>
    );
}