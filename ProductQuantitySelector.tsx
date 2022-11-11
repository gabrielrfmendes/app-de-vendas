import styled from 'styled-components/native';
import { Pressable } from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';

const QuantitySelectorContainer = styled.View`
    position: absolute;
    right: 10px;
    bottom: 5px;
    height: 30px;
    flex-direction: row;
    align-items: center;
`;
const QuantitySelectorInput = styled.TextInput`
    height: 100%;
    width: 45px;
    font-size: 18px;
    text-align: center;
`;

export default function ProductQuantitySelector(props) {
    return (
        <QuantitySelectorContainer>
            <Pressable android_ripple={{ borderless: true, radius: 20 }}>
                <FeatherIcon name='minus-circle' size={24} color='#34a853' />
            </Pressable>
            <QuantitySelectorInput
                value={String(props.quantity || 0)}
                keyboardType='number-pad'
                selectionColor='#5848FF'
            />
            <Pressable android_ripple={{ borderless: true, radius: 20 }}>
                <FeatherIcon name='plus-circle' size={24} color='#34a853' />
            </Pressable>
        </QuantitySelectorContainer>
    )
}