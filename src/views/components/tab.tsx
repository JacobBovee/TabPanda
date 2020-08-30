import { h } from 'preact';
import Icon from './icon';
import { DATA_TAB_ID_ATTRIBUTE_NAME } from '../../constants';

interface IProps {
    tab: chrome.tabs.Tab;
}

export default function Tab(props: IProps) {
    const { tab } = props;
    const ico = tab.favIconUrl ? <Icon type={'custom'} iconSrc={tab.favIconUrl} /> : <Icon type="link" />;
    const dataAttributes = { [DATA_TAB_ID_ATTRIBUTE_NAME]: tab.id };
    return (<li class="tab" {...dataAttributes}><span>{ico}{tab.title}</span><Icon className='more' type={'more'} /></li>);
}