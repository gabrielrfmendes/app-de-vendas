import ListRow from './ListRow';
import styled from 'styled-components/native';
import formatMonetaryValue from './formatMonetaryValue';
import FeatherIcon from '@expo/vector-icons/Feather';
import { Pressable, Alert } from 'react-native';
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
    right: 15px;
    bottom: 5px;
    height: 30px;
    flex-direction: row;
    align-items: center;
`;
const QuantitySelectorInput = styled.TextInput`
    height: 100%;
    width: 50px;
    font-size: 18px;
    text-align: center;
`;

type ProductListRowProps = {
    productId: number;
    mediaSource?: string;
    title: string;
    price: number;
    quantity: number;
};

export default function ProductListRow(props: ProductListRowProps) {
    function addUnit() {
        database.transaction(transaction => {
            if (!props.quantity) {
                transaction.executeSql(`
                    INSERT INTO OrderProducts (
                        orderId,
                        productId,
                        price,
                        quantity
                    ) VALUES (
                        (SELECT id FROM Orders WHERE status = 'open'),
                        ${props.productId},
                        ${props.price},
                        ${1}
                    )
                `, [], () => {}, (_, sqlStatementError) => {
                    throw Error(sqlStatementError.message)
                })
            } else {
                transaction.executeSql(`
                    UPDATE OrderProducts SET 
                        quantity = ${props.quantity + 1}
                    WHERE OrderProducts.orderId = (SELECT id FROM Orders WHERE status = 'open')
                    AND OrderProducts.productId = ${props.productId};
                `, [], () => {}, (_, sqlStatementError) => {
                    throw Error(sqlStatementError.message)
                })
            }
        }, transactionError => {
           throw Error(transactionError.message)
        });
    }

    function removeUnit() {
        database.transaction(transaction => {
            if (props.quantity === 1) {
                Alert.alert(
                    'Remover produto',
                    'Deseja remover este produto do pedido?',
                    [
                        {
                            text: 'Não',
                            style: 'cancel'
                        },
                        { 
                            text: 'Sim', 
                            onPress: () => {
                                database.transaction(transaction => {
                                    transaction.executeSql(`
                                        DELETE FROM OrderProducts 
                                        WHERE productId = ${props.productId}
                                        AND orderId = (SELECT id FROM Orders WHERE status = 'open')
                                    `, [], () => {}, (_, sqlStatementError) => {
                                        throw Error(sqlStatementError.message)
                                    })
                                })
                            }
                        }
                    ]
                )
            } else {
                transaction.executeSql(`
                    UPDATE OrderProducts SET 
                        quantity = ${props.quantity - 1}
                    WHERE OrderProducts.orderId = (SELECT id FROM Orders WHERE status = 'open')
                    AND OrderProducts.productId = ${props.productId};
                `, [], () => {}, (_, sqlStatementError) => {
                    throw Error(sqlStatementError.message)
                })
            }
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
                    android_ripple={{ borderless: true, radius: 30 }}
                    onPress={removeUnit}
                >
                    <FeatherIcon name='minus-circle' size={28} color='#34a853' />
                </Pressable>
                <QuantitySelectorInput
                    value={String(props.quantity || 0)}
                    keyboardType='number-pad'
                    selectionColor='#34a853'
                />
                <Pressable 
                    android_ripple={{ borderless: true, radius: 30 }}
                    onPress={addUnit}
                >
                    <FeatherIcon name='plus-circle' size={28} color='#34a853' />
                </Pressable>
            </QuantitySelectorContainer>
        </>
    )
}