import React from 'react';
import { Panel, Placeholder, PanelHeader, Button } from '@vkontakte/vkui';



class Home extends React.Component {

  render() {
    return (
      <Panel id={this.props.id}>
        <PanelHeader>Подкасты</PanelHeader>
        <Placeholder stretched header='Добавьте первый подкаст' action={
          <Button size='l' onClick={() => this.props.go('creation')}>Добавить подкаст</Button>
        }>
          Добавляйте, редактируйте и делитесь подкастами вашего сообщества.
        </Placeholder>
      </Panel>
    )
  }
}

export default Home;
