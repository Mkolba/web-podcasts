import React from 'react';
import { Panel, Placeholder, PanelHeader, PanelHeaderBack, Button, FormLayout, Checkbox, Cell, Group, Spinner, Separator,
         File, FormLayoutGroup, Input, Textarea, Select, Div, Card, FixedLayout, Avatar, Link, Header } from '@vkontakte/vkui';

import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';

class Posting extends React.Component {

  render() {
    let data = this.props.data;
    let canGo = data.name && data.image && data.audio && data.description;

    return (
      <Panel id={this.props.id}>
        <PanelHeader left={<PanelHeaderBack onClick={this.props.goBack}/>}></PanelHeader>
        <Placeholder icon={<Icon56CheckCircleOutline />}header='Подкаст опубликован' action={<Button>Поделиться подкастом</Button>}>
          Расскажите своим подписчикам о новом подкасте, чтобы получить больше слушателей.
        </Placeholder>
      </Panel>
    )
  }
}

export default Posting;
