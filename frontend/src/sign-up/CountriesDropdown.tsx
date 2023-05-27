import { CountryT } from "customer-commons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "../constants/colors";
import { Styles } from "../constants/styles";

const countryChoserContainerMarginBottom = 10;

const labelFontSize = 12;
const labelFontWeight = "500" as const;
const labelMarginBottom = 3;

const countriesListMaxHeight = 248;
const countriesListLeftPosition = -20;
const countriesListRightPosition = -20;
const countriesListTopPosition = 53;

const countryItemHeight = 40;
const pressableCountryItemOpacity = 1;
const notPressableCountryItemOpacity = 0.4;

const countryNameFontSize = 15;
const countryNameFontWeight = "500" as const;
const highlightedCountryNameLeftMargin = 15;
const countrySupportNoMargin = 0;

const highlightedCountryItemPosition = 5;

const textInputHeight = 25;
const textInputFontSize = 17;
const textInputFontWeight = "300" as const;

const arrowIconHeight = 7;
const arrowIconWidth = 14;
const arrowIconButtonOffset = 20;

export function CountriesDropdown(props: {
  countries: CountryT[];
  initialCountry: string;
  onCountryPress: (text: string) => void;
  errorCheckerButtonPressedFlag: number;
}) {
  const dropdownFadeAnimation = useRef(new Animated.Value(0)).current;
  const cancelDropdownFadeAnimation = useRef<(() => void) | undefined>(
    undefined
  );

  const errorContainerAnimationValue = useRef(new Animated.Value(0)).current;
  const cancelErrorContainerAnimation = useRef<(() => void) | undefined>(
    undefined
  );

  const [isCountriesListVisible, setIsCountriesListVisisble] = useState(false);

  const [queryText, setQueryText] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("Select country");
  const [hoveredCountry, setHoveredCountry] = useState("");

  const [isError, setIsError] = useState(false);

  const performErrorAnimation = useCallback(() => {
    const animation = Animated.sequence([
      Animated.timing(errorContainerAnimationValue, {
        toValue: 10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(errorContainerAnimationValue, {
        toValue: -10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(errorContainerAnimationValue, {
        toValue: 10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(errorContainerAnimationValue, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]);

    cancelErrorContainerAnimation.current = animation.stop;

    animation.start();
  }, []);

  useEffect(() => {
    return () => {
      cancelDropdownFadeAnimation.current?.();
      cancelErrorContainerAnimation.current?.();
    };
  }, []);

  useEffect(() => {
    if (props.initialCountry.length > 0) {
      setSelectedCountry(props.initialCountry);
    }
  }, [props.initialCountry]);

  useEffect(() => {
    const isFirstMount = props.errorCheckerButtonPressedFlag === 0;

    if (isFirstMount) {
      return;
    }

    const countryNotChosen = selectedCountry === "Select country";

    if (countryNotChosen) {
      setIsError(true);
      performErrorAnimation();
    }
  }, [selectedCountry, props.errorCheckerButtonPressedFlag]);

  const wholeContainerStyle = useMemo(
    (): StyleProp<ViewStyle> | Animated.Animated => ({
      transform: [{ translateX: errorContainerAnimationValue }],
      zIndex: isCountriesListVisible ? 1 : 0,
      marginLeft: Styles.margin,
      marginRight: Styles.margin,
      marginTop: Styles.margin,
    }),
    [isCountriesListVisible]
  );

  const countryChoserContainerStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: countryChoserContainerMarginBottom,
    }),
    []
  );

  const labelAndTextInputContainerStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
    }),
    []
  );

  const labelStyle = useMemo(
    (): StyleProp<TextStyle> => ({
      fontSize: labelFontSize,
      fontWeight: labelFontWeight,
      color: !isCountriesListVisible && isError ? Colors.red : Colors.gray,
      marginBottom: labelMarginBottom,
    }),
    [isError, isCountriesListVisible]
  );

  const textInputStyle = useMemo(
    () => ({
      height: textInputHeight,
      fontSize: textInputFontSize,
      fontWeight: textInputFontWeight,
      outlineStyle: "none",
      color: Colors.black,
    }),
    []
  );

  const arrowIconButtonStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      height: arrowIconHeight + arrowIconButtonOffset,
      width: arrowIconWidth + arrowIconButtonOffset,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    }),
    []
  );

  const arrowIconImageStyle = useMemo(
    () => ({
      height: arrowIconHeight,
      width: arrowIconWidth,
    }),
    []
  );

  const indicatorLineStyle = useMemo(
    () => ({
      backgroundColor: isCountriesListVisible
        ? Colors.blue
        : isError
        ? Colors.red
        : Colors.gray,
      height: StyleSheet.hairlineWidth,
    }),
    [isCountriesListVisible, isError]
  );

  const countryItemStyle = useCallback(
    (opacity: number): StyleProp<ViewStyle> => ({
      height: countryItemHeight,
      justifyContent: "center",
      opacity: opacity,
    }),
    []
  );

  const countryNameStyle = useCallback(
    (colorText: string, marginLeft: number): StyleProp<TextStyle> => ({
      fontSize: countryNameFontSize,
      fontWeight: countryNameFontWeight,
      color: colorText,
      marginLeft: marginLeft,
    }),
    []
  );

  const highlightedCountryItemStyle = useMemo(
    (): StyleProp<ViewStyle> => ({
      position: "absolute",
      left: highlightedCountryItemPosition,
      right: highlightedCountryItemPosition,
      top: highlightedCountryItemPosition,
      bottom: highlightedCountryItemPosition,
      backgroundColor: Colors.highlightedItem,
      borderRadius: Styles.borderRadius,
      justifyContent: "center",
    }),
    []
  );

  const countriesContainerStyle = useMemo(
    (): StyleProp<ViewStyle> | Animated.Animated => ({
      position: "absolute",
      maxHeight: countriesListMaxHeight,
      left: countriesListLeftPosition,
      right: countriesListRightPosition,
      top: countriesListTopPosition,
      opacity: dropdownFadeAnimation,
      borderRadius: Styles.borderRadius,
      backgroundColor: "white",
    }),
    []
  );

  const changeCountriesListVisibility = useCallback((isVisible: boolean) => {
    if (!isVisible) {
      setQueryText("");
    }

    setIsCountriesListVisisble(isVisible);

    const animation = Animated.timing(dropdownFadeAnimation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    });

    cancelDropdownFadeAnimation.current = animation.stop;

    animation.start();
  }, []);

  const onChangeText = useCallback((text: string) => {
    setQueryText(text);
  }, []);

  const onDropdownPress = useCallback(() => {
    changeCountriesListVisibility(!isCountriesListVisible);
  }, [isCountriesListVisible]);

  const onTextInputFocus = useCallback(() => {
    if (!isCountriesListVisible) {
      changeCountriesListVisibility(true);
    }
  }, [isCountriesListVisible]);

  const onCountryPress = useCallback(
    (countryName: string) => {
      setSelectedCountry(countryName);
      props.onCountryPress(countryName);

      changeCountriesListVisibility(false);

      setIsError(false);
    },
    [props.onCountryPress]
  );

  const onCountryHover = useCallback((countryName: string) => {
    setHoveredCountry(countryName);
  }, []);

  const renderNotPressableCountryItem = useCallback(
    (countryName: string, countrySupport: string) => {
      const userMessageSupport =
        countrySupport === "coming-soon" ? (
          <Text style={countryNameStyle(Colors.green, countrySupportNoMargin)}>
            (Coming Soon)
          </Text>
        ) : (
          <Text style={countryNameStyle(Colors.red, countrySupportNoMargin)}>
            (Not Supported)
          </Text>
        );

      return (
        <View style={countryItemStyle(notPressableCountryItemOpacity)}>
          <Text style={countryNameStyle(Colors.gray, Styles.margin)}>
            {countryName} {userMessageSupport}
          </Text>
        </View>
      );
    },
    []
  );

  const renderPressableCountryItem = useCallback(
    (countryName: string) => (
      <Pressable
        onPress={() => onCountryPress(countryName)}
        onHoverIn={() => onCountryHover(countryName)}
        onHoverOut={() => onCountryHover("")}
        style={countryItemStyle(pressableCountryItemOpacity)}
      >
        {countryName === selectedCountry ? (
          <View style={highlightedCountryItemStyle}>
            <Text
              style={countryNameStyle(
                Colors.blue,
                highlightedCountryNameLeftMargin
              )}
            >
              {countryName}
            </Text>
          </View>
        ) : countryName === hoveredCountry ? (
          <View style={highlightedCountryItemStyle}>
            <Text
              style={countryNameStyle(
                Colors.black,
                highlightedCountryNameLeftMargin
              )}
            >
              {countryName}
            </Text>
          </View>
        ) : (
          <Text style={countryNameStyle(Colors.gray, Styles.margin)}>
            {countryName}
          </Text>
        )}
      </Pressable>
    ),
    [selectedCountry, hoveredCountry]
  );

  const renderCountryItem = useCallback(
    (countryRow: ListRenderItemInfo<CountryT>) => (
      <View>
        {countryRow.item.support === "full"
          ? renderPressableCountryItem(countryRow.item.name)
          : renderNotPressableCountryItem(
              countryRow.item.name,
              countryRow.item.support
            )}
      </View>
    ),
    [selectedCountry, hoveredCountry]
  );

  const selectedCountryView = useCallback(
    () => (
      <TextInput
        onFocus={onTextInputFocus}
        onChangeText={onChangeText}
        style={textInputStyle}
        editable={isCountriesListVisible}
        value={isCountriesListVisible ? queryText : selectedCountry}
      />
    ),
    [isCountriesListVisible, queryText, selectedCountry]
  );

  const maybeRenderList = useCallback(
    () => (
      <Animated.View style={countriesContainerStyle}>
        <FlatList
          data={props.countries.filter((country) =>
            country.name.toLowerCase().includes(queryText.toLocaleLowerCase())
          )}
          renderItem={renderCountryItem}
          keyExtractor={(country) => country.code}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    ),
    [props.countries, queryText, hoveredCountry, selectedCountry]
  );

  return (
    <Animated.View style={wholeContainerStyle}>
      <View style={countryChoserContainerStyle}>
        <View style={labelAndTextInputContainerStyle}>
          <Text style={labelStyle}>COUNTRY OF RESIDENCE</Text>

          {selectedCountryView()}
        </View>

        <Pressable onPress={onDropdownPress} style={arrowIconButtonStyle}>
          <Image
            source={require("../../assets/images/arrow_down.png")}
            style={arrowIconImageStyle}
          />
        </Pressable>
      </View>

      <View style={indicatorLineStyle} />

      {maybeRenderList()}
    </Animated.View>
  );
}
