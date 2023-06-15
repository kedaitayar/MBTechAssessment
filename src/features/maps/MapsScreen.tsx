import React, {useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {
  useGetGeoCodingPlaceIdQuery,
  useGetPlaceAutocompleteQuery,
} from '../../stores/services/googleMapsApi';
import {skipToken} from '@reduxjs/toolkit/query';

interface MapsScreenProps {}

export const MapsScreen: React.FunctionComponent<MapsScreenProps> = ({}) => {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const {data: autoCompleteData} = useGetPlaceAutocompleteQuery(
    textInput.length > 0 ? {input: textInput} : skipToken,
  );
  const {data: geoCodingData} = useGetGeoCodingPlaceIdQuery(
    selectedPlaceId ? {placeId: selectedPlaceId} : skipToken,
  );

  const coords = useMemo(() => {
    if (geoCodingData?.results[0]) {
      return {
        latitude: geoCodingData.results[0].geometry.location.lat,
        longitude: geoCodingData.results[0].geometry.location.lng,
        latitudeDelta:
          Math.abs(
            geoCodingData.results[0].geometry.viewport.northeast.lat -
              geoCodingData.results[0].geometry.viewport.southwest.lat,
          ) + 0.0015,
        longitudeDelta:
          Math.abs(
            geoCodingData.results[0].geometry.viewport.northeast.lng -
              geoCodingData.results[0].geometry.viewport.southwest.lng,
          ) + 0.0015,
      };
    } else {
      return null;
    }
  }, [geoCodingData]);

  return (
    <View style={[{flex: 1}]}>
      <MapView
        provider={'google'}
        style={[{height: 300}]}
        initialRegion={{
          latitude: 4.021534263337328,
          latitudeDelta: 7.96323861677378,
          longitude: 108.87486493214965,
          longitudeDelta: 24.51290231198071,
        }}
        region={coords ?? undefined}>
        {coords && <Marker coordinate={coords} />}
      </MapView>
      <TextInput
        placeholder={'location'}
        value={textInput}
        onChangeText={setTextInput}
      />
      <View
        style={[
          {
            height: StyleSheet.hairlineWidth,
            backgroundColor: 'black',
          },
        ]}
      />
      {autoCompleteData?.predictions.map((value, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedPlaceId(value.place_id);
            }}>
            <View
              style={[
                {
                  paddingHorizontal: 8,
                  paddingTop: 4,
                },
              ]}>
              <Text
                style={[
                  {
                    lineHeight: 24,
                    fontSize: 16,
                    letterSpacing: 0.15,
                    fontWeight: '500',
                    opacity: 0.87,
                  },
                ]}>
                {value.structured_formatting?.main_text}
              </Text>
              <Text
                style={[
                  {
                    lineHeight: 16,
                    fontSize: 12,
                    letterSpacing: 0.5,
                    fontWeight: '500',
                    opacity: 0.87,
                  },
                ]}>
                {value.structured_formatting?.secondary_text}
              </Text>
              <View
                style={[
                  {
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: 'black',
                    marginTop: 4,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
