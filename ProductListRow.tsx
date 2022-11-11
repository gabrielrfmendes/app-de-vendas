import ListRow from './ListRow';
import styled from 'styled-components/native';
import FeatherIcon from '@expo/vector-icons/Feather';
import { Pressable } from 'react-native';
import { useState } from 'react';
import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('database');

const MediaContainer = styled.View`
    background-color: #E5E5E5;
    height: 115px;
    width: 115px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    overflow: hidden;
`;
const ProductMediaSource = styled.Image`
    height: 100%;
    width: 100%;
`;
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

function formatMonetaryValue(amount: number) {
    let formattedAmount = String(amount);
    
    if (formattedAmount.indexOf('.') !== -1) {
        let [reais, cents] = String(formattedAmount).split('.');

        reais = reais
            .replace(/^(0+)(\d)/g, '$2')
            .replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1.');

        if (cents.length === 1) {
            cents = `${cents}0`
        }

        return `R$ ${reais},${cents}`
    }
    formattedAmount = formattedAmount
        .replace(/^(0+)(\d)/g, '$2')
        .replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1.');
    
    return `R$ ${formattedAmount},00`
}

type ProductListRowProps = {
    id: number;
    mediaSource?: string;
    title: string;
    price: number;
    quantity: number;
};

export default function ProductListRow(props: ProductListRowProps) {
    const [productUnits, setProductUnits] = useState(props.quantity? props.quantity : 0)

    function addUnit() {
        database.transaction(transaction => {
            transaction.executeSql(`
                UPDATE OrderProducts SET 
                    quantity = ${productUnits + 1}
                WHERE OrderProducts.orderId = (SELECT id FROM Orders WHERE status = 'open')
                AND OrderProducts.productId = ${props.id};
            `, [], (_, { rowsAffected }) => {
                console.log('Funcio' + rowsAffected)
                setProductUnits(productUnits + 1)
            }, (_, sqlStatementError) => {
                throw Error(sqlStatementError.message)
            })
        }, transactionError => {
           throw Error(transactionError.message)
        })
    }

    function removeUnit() {
        database.transaction(transaction => {
            transaction.executeSql(`
                UPDATE OrderProducts SET 
                    quantity = ${productUnits - 1}
                WHERE OrderProducts.orderId = 1
                AND OrderProducts.productId = ${props.id};
            `, [], (_, { rowsAffected }) => {
                console.log('Funcio' + rowsAffected)
                setProductUnits(productUnits - 1)
            }, (_, sqlStatementError) => {
                throw Error(sqlStatementError.message)
            })
        }, transactionError => {
           throw Error(transactionError.message)
        })
    }

    return (
        <>
            <ListRow
                height={120}
                supportingVisual={<MediaContainer>
                    {props.mediaSource ? (
                        <ProductMediaSource source={{ uri: props.mediaSource }} />
                    ) : (
                        <FeatherIcon name='tag' size={30} color='#34a853' />
                    )}
                </MediaContainer>}
                primaryText={props.title}
                secondaryText={formatMonetaryValue(props.price)}
                onPress={() => {}}
            />
            <QuantitySelectorContainer>
                <Pressable 
                    android_ripple={{ borderless: true, radius: 20 }}
                    onPress={removeUnit}
                >
                    <FeatherIcon name='minus-circle' size={24} color='#34a853' />
                </Pressable>
                <QuantitySelectorInput
                    value={String(productUnits)}
                    keyboardType='number-pad'
                    selectionColor='#5848FF'
                />
                <Pressable 
                    android_ripple={{ borderless: true, radius: 20 }}
                    onPress={addUnit}
                >
                    <FeatherIcon name='plus-circle' size={24} color='#34a853' />
                </Pressable>
            </QuantitySelectorContainer>
        </>
    )
}