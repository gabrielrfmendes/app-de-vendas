import { useState } from 'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    Button
} from 'react-native';
import styled from 'styled-components/native';
import FeatherIcon from '@expo/vector-icons/Feather';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('database');
const PictureInput = styled.TouchableOpacity`
    background-color: #E5E5E5;
    height: 130px;
    width: 130px;
    align-self: center;
    margin: 5px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    overflow: hidden;
`;
const TextInput = styled.TextInput`
    height: 56px;
    font-Size: 18px;
    padding: 10px;
`;
const Label = styled.Text`
    font-size: 17px;
    color: #34a853;
    left: 5px;
    top: 15px;
`;
const ValidationMessageContainer = styled.View`
    flex-direction: row;
    align-Items: center;
    height: 20px;
`;
const ValidationMessage = styled.Text`
    left: 2px;
    font-size: 14px;
    color: #d93025;
`;
const ActionSheetIconContainer = styled.View`
    height: 40px;
    width: 40px;
    border-radius: 20px;
    align-items: center;
    justify-content: center;
`;

function formatMonetaryInput(amount: string) {
    let reais = '0';
    let cents = '00';

    amount = amount.replace(/[^0-9]/g, '');

    if (amount.length > 2) {
        reais = amount.substring(0, amount.length - 2);
        cents = amount.substring(amount.length -2, amount.length)
    } else {
        if (amount.length === 1) {
            cents = `0${amount}`
        } 
        
        if (amount.length === 2) {
            cents = amount
        }
    }

    reais = reais.
        replace(/^(0+)(\d)/g, '$2').
        replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1.')

    return `R$ ${reais},${cents}`
}

function removeMonetaryFormat(amount: string) {
    amount = amount
        .replace('R$ ', '')
        .replace(/\./g, '')
        .replace(',','.');

    return Number(amount)
}

export default function ProductCreate({ navigation }) {
    const { showActionSheetWithOptions } = useActionSheet();
    const [mediaSource, setMediaSource] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('R$ 0,00');
    const [titleValidationMessage, setTitleValidationMessage] = useState('');
    const [priceValidationMessage, setPriceValidationMessage] = useState('');
    const [titleInputUnderlineColor, setTitleInputUnderlineColor] = useState('#34a853');
    const [priceInputUnderlineColor, setPriceInputUnderlineColor] = useState('#34a853');

    function handleChangePicture() {
        const actionSheetOptions = ['Câmera', 'Galeria'];
        const actionSheetOptionsIcons = [
            <ActionSheetIconContainer style={{ backgroundColor: '#EC407A' }}>
                <FeatherIcon name='instagram' color='#F5F5F5' size={20} />
            </ActionSheetIconContainer>,
            <ActionSheetIconContainer style={{ backgroundColor: '#BF59CF' }}>
                <FeatherIcon name='image' color='#F5F5F5' size={20} />
            </ActionSheetIconContainer>
        ];
        const imagePickerOptions: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        };
    
        async function openCamera() {
            const result = await ImagePicker.launchCameraAsync(imagePickerOptions);
    
            if (!result.cancelled) {
                setMediaSource(result.uri)
            }
        }
        
        async function openGallery() {
            const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
    
            if (!result.cancelled) {
                setMediaSource(result.uri)
            }
        }

        if (mediaSource) {
            actionSheetOptions.push('Remover imagem');
            actionSheetOptionsIcons.push(
                <ActionSheetIconContainer style={{ backgroundColor: '#D93025' }}>
                    <FeatherIcon name='trash-2' color='#F5F5F5' size={20} />
                </ActionSheetIconContainer>
            )
        }

        showActionSheetWithOptions({
            title: 'Imagem do produto',
            options: actionSheetOptions,
            icons: actionSheetOptionsIcons,
            cancelButtonIndex: mediaSource ? 3 : 2
        },
        buttonIndex => {
            if (buttonIndex === 0) {
                openCamera()
            }

            if (buttonIndex === 1) {
                openGallery()
            }

            if (buttonIndex === 2) {
                setMediaSource('')
            }
        })
    }

    function handleChangeTitle(text: string) {
        setTitle(text);
        setTitleInputUnderlineColor('#34a853');
        setTitleValidationMessage('')
    }

    function handleChangePrice(text: string) {
        setPrice(formatMonetaryInput(text));
        setPriceInputUnderlineColor('#34a853');
        setPriceValidationMessage('')
    }

    function validateTitle() {
        if (!title) {
            setTitleInputUnderlineColor('#d93025');
            setTitleValidationMessage('Digite um título para o produto.')
        }
    }

    function validatePrice() {
        if (price === 'R$ 0,00') {
            setPriceInputUnderlineColor('#d93025');
            setPriceValidationMessage('Digite um preço para o produto.')
        }
    }

    function insertProduct() {
        if (title && price !== 'R$ 0,00') {
            database.transaction(transaction => {
                transaction.executeSql(`
                    INSERT INTO Products (
                        mediaSource,
                        title,
                        price
                    ) VALUES (
                        '${mediaSource}',
                        '${title}',
                        ${removeMonetaryFormat(price)}
                    )
                `, [], () => {
                    navigation.goBack()
                }, (_, SQLStatementError) => {
                    throw new Error(SQLStatementError.message)
                })
            }, SQLTransactionError => {
                throw new Error(SQLTransactionError.message)
            })
        }
    }
    
    async function handleProductCreate() {
        insertProduct();
        validateTitle();
        validatePrice()
    }
    
    return (
        <ScrollView style={{ flex: 1, padding: 15 }}>
            <PictureInput style={{ elevation: 1 }} onPress={handleChangePicture}>
                {mediaSource ? (
                    <Image style={{ height: '100%', width: '100%' }} source={{ uri: mediaSource }} />
                ) : (
                    <FeatherIcon name='image' size={38} color='#34a853' />
                )}
            </PictureInput>
            <Label>
                Título
            </Label>
            <TextInput
                selectionColor='#34a853'
                underlineColorAndroid={titleInputUnderlineColor}
                placeholder='Digite um título'
                value={title}
                onChangeText={handleChangeTitle}
            />
            <ValidationMessageContainer>
                {titleValidationMessage && <FeatherIcon name='alert-circle' size={18} color='#d93025' />}
                <ValidationMessage>
                    {titleValidationMessage}
                </ValidationMessage>
            </ValidationMessageContainer>
            <Label>
                Preço
            </Label>
            <View style={{ height: 56 }}>
                <TextInput
                    style={{ color: 'transparent' }}
                    selectionColor='transparent'
                    underlineColorAndroid={priceInputUnderlineColor}
                    maxLength={17}
                    value={price}
                    keyboardType='number-pad'
                    onChangeText={handleChangePrice}
                />
                <Text style={{
                    height: 56,
                    position: 'absolute', 
                    top: 16, 
                    justifyContent: 'center',
                    fontSize: 18,
                    paddingHorizontal: 10
                }}>
                    {price}
                </Text>
            </View>
            <ValidationMessageContainer>
                {priceValidationMessage && <FeatherIcon name='alert-circle' size={18} color='#d93025' />}
                <ValidationMessage>
                    {priceValidationMessage}
                </ValidationMessage>
            </ValidationMessageContainer>
            <View style={{ paddingTop: 15 }}>
                <Button
                    title='Cadastrar produto' 
                    color='#34a853' 
                    onPress={handleProductCreate} 
                />
            </View>
        </ScrollView>
    )
}