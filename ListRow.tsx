import { ReactNode } from 'react';
import { 
    StyleSheet
} from 'react-native';
import {
    ListItem,
    Colors,
    Text
} from 'react-native-ui-lib';

type ListRowProps = {
    height?: number | string;
    onPress?: () => void;
    supportingVisual?: ReactNode;
    primaryText: string;
    secondaryText?: string;
};

export default function ListRow(props: ListRowProps) {
    return (
        <ListItem
            activeBackgroundColor={Colors.grey50}
            activeOpacity={0.3}
            height={props.height}
            onPress={props.onPress}
        >
            {props.supportingVisual && <ListItem.Part left containerStyle={{ padding: 5 }}>
                {props.supportingVisual}
            </ListItem.Part>}
            <ListItem.Part middle column containerStyle={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderColor: Colors.grey30,
                padding: 5,
                paddingRight: 10
            }}>
                <ListItem.Part>
                    <Text text70 numberOfLines={3}>
                        {props.primaryText}
                    </Text>
                </ListItem.Part>
                {props.secondaryText && <ListItem.Part>
                    <Text text70 grey20 numberOfLines={1}>
                        {props.secondaryText}
                    </Text>
                </ListItem.Part>}
            </ListItem.Part>
        </ListItem>
    )
}