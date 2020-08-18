import { h } from 'preact';
import Icon from './icon';

interface IProps {
    tab: chrome.tabs.Tab;
}

export default function Tab(props: IProps) {
    const { tab } = props;
    const ico = tab.favIconUrl ? <Icon type={'custom'} iconSrc={tab.favIconUrl} /> : <Icon type="link" />;
    return (<li class="tab" data-tab-id={tab.index}><span>{ico}{tab.title}</span><Icon className='more' type={'more'} /></li>);
}