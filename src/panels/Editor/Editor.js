import React from 'react';
import { Panel, Placeholder, PanelHeader, PanelHeaderBack, Button, FormLayout, Checkbox, Cell, Group, Spinner, Separator,
         File, FormLayoutGroup, Input, Textarea, Select, Div, Card, FixedLayout, Avatar, Header, CellButton } from '@vkontakte/vkui';
import Icon28TargetOutline from '@vkontakte/icons/dist/28/target_outline';
import Icon28CalendarOutline from '@vkontakte/icons/dist/28/calendar_outline';
import Icon28PictureOutline from '@vkontakte/icons/dist/28/picture_outline';
import Icon56GalleryOutline from '@vkontakte/icons/dist/56/gallery_outline';
import Icon28PodcastOutline from '@vkontakte/icons/dist/28/podcast_outline';
import Icon24ArrowUturnLeftOutline from '@vkontakte/icons/dist/24/arrow_uturn_left_outline';
import Icon28MusicOutline from '@vkontakte/icons/dist/28/music_outline';
import Icon28Pause from '@vkontakte/icons/dist/28/pause';
import Icon28Play from '@vkontakte/icons/dist/28/play';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import { ReactComponent as ScissorsIcon } from '../../img/scissors.svg';

import WaveSurfer from 'wavesurfer.js';
import './Editor.css';

class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      wavesurfer: null,
      waveform: null,
      isPlaying: false
    }
  }

  addTimecode = () => {
    this.props.data.timecodes.push({time: '', name: ''});
    this.props.commit(this.props.data);
  }

  delTimecode = (index) => {
    this.props.data.timecodes.splice(this.props.data.timecodes.indexOf(index), 1);
    this.props.commit(this.props.data);
  }

  onDescriptionChange = (value, index) => {
    this.props.data.timecodes[index]['name'] = value;
    this.props.commit(this.props.data)
  }

  onTimeChange = (value, index) => {
    this.props.data.timecodes[index]['time'] = value;
    this.props.commit(this.props.data)
  }

  toggleFadeIn = () => {
    this.props.data.fadeIn = !this.props.data.fadeIn;
    this.props.commit(this.props.data);
  }

  toggleFadeOut = () => {
    this.props.data.fadeOut = !this.props.data.fadeOut;
    this.props.commit(this.props.data);
  }

  componentDidMount() {
    let src = window.URL.createObjectURL(this.props.data.audio)
    let wavesurfer = WaveSurfer.create({
      container: '#waveform',
      scrollParent: true,
      barWidth: 2,
      cursorColor: '#FF3347',
      height: 96,
      barGap: 3,
      barRadius: 2,
      progressColor: '#3F8AE0',
      waveColor: '#3F8AE0',

    });
    wavesurfer.load(src);
    wavesurfer.on('ready', () => {
      this.setState({ waveform: true, wavesurfer: wavesurfer, duration: wavesurfer.getDuration() });
    });
    wavesurfer.on('finish', () => {
      this.setState({ isPlaying: false });
    });
    wavesurfer.on('audioprocess', (e) => {
      if (this.props.data.fadeOut && e + 5 > this.state.duration && !this.state.fadeOut) {
        let context = this.state.wavesurfer.backend.ac;
        let gainNode = context.createGain();

        gainNode.gain.cancelScheduledValues(context.currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 5);

        this.state.wavesurfer.backend.setFilter(gainNode);
        this.setState({ fadeOut: true });
      } else if (this.props.data.fadeOut && e + 5 < this.state.duration && this.state.fadeOut) {
        this.setState({ fadeOut: false });
      }
    });

  }

  play = () => {
    this.setState({ isPlaying: true }, () => {
      this.state.wavesurfer.play();
      let context = this.state.wavesurfer.backend.ac;
      let gainNode = context.createGain();
      if (this.props.data.fadeIn && this.state.wavesurfer.getCurrentTime() < 3) {
        gainNode.gain.cancelScheduledValues(context.currentTime);
        gainNode.gain.setValueAtTime(0.0001, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(1.0, context.currentTime + 3);
        this.state.wavesurfer.backend.setFilter(gainNode);
      }
    });
  }

  pause = () => {
    this.setState({ isPlaying: false }, () => this.state.wavesurfer.pause());
  }

  render() {
    let data = this.props.data;
    let canGo = data.name && data.image && data.audio && data.description;

    let ruler = [];
    for (let i = 0; i < 50; i++) {
      ruler.push(<div className='rectangle-small'/>);
      ruler.push(<div className='rectangle-medium'/>);
    }

    return (
      <Panel id={this.props.id}>
        <PanelHeader left={<PanelHeaderBack onClick={this.props.goBack}/>}>Редактирование</PanelHeader>
        <div className='flex EditorWrapper'>
          <Card className='flex Editor'>
            <div className='Editor__ruler'>
              {ruler}
            </div>

            <div className='Editor__waveform'>
              <div id='waveform'>{!this.state.waveform && <Spinner style={{ paddingTop: 40 }}/>}</div>
              {data.fadeIn && <div className='FadeIn'>Появление: вкл</div>}
              {data.fadeOut && <div className='FadeOut'>Затухание: вкл</div>}
            </div>

            <div className='Editor__controls flex' style={{ flexDirection: 'row' }}>
              { !this.state.isPlaying ?
                  <Button style={{ marginLeft: 8 }} onClick={this.play} disabled={!this.state.waveform}><Icon28Play/></Button>
                :
                  <Button style={{ marginLeft: 8 }} onClick={this.pause}><Icon28Pause/></Button>
              }

              <div style={{ flexGrow: 1, flexDirection: 'row' }} className='flex'>
                <Button mode='secondary' disabled><ScissorsIcon style={{ width: 20, height: 20, fill: 'var(--button_secondary_foreground)' }}/></Button>
                <Button mode='secondary' disabled><Icon24ArrowUturnLeftOutline/></Button>
              </div>
              <Button mode={data.background ? 'primary' : 'secondary'} disabled><Icon28MusicOutline width={24} height={24}/></Button>
              <Button mode={data.fadeIn ? 'primary' : 'secondary'} onClick={this.toggleFadeIn}>
                <div className='Chart' style={{ flexDirection: 'row', alignItems: 'flex-end', color: data.fadeIn ? 'white' : '#4986cc' }}>
                  <div style={{ height: 4 }}/>
                  <div style={{ height: 12 }}/>
                  <div style={{ height: 18 }}/>
                </div>
              </Button>
              <Button mode={data.fadeOut ? 'primary' : 'secondary'} style={{ marginRight: 8 }} onClick={this.toggleFadeOut}>
                <div className='Chart' style={{ flexDirection: 'row', alignItems: 'flex-end', color: data.fadeOut ? 'white' : '#4986cc' }}>
                  <div style={{ height: 18 }}/>
                  <div style={{ height: 12 }}/>
                  <div style={{ height: 4 }}/>
                </div>
              </Button>

            </div>
          </Card>
        </div>

        <Group className='Timecodes' header={<Header mode='secondary'>Таймкоды</Header>} description='Отметки времени с названием темы. Позволяют слушателям легче путешествовать по подкасту.'>
          {
            data.timecodes.map((item, i) => {
              return (
                <Cell removable key={i} onRemove={() => this.delTimecode(i)}>
                  <div className='flex' style={{ flexDirection: 'row' }}>
                    <FormLayout className='Timecode__description'>
                      <Input placeholder='Описание таймкода' value={data.timecodes[i]['name']} onChange={e => (this.onDescriptionChange(e.target.value, i))}/>
                    </FormLayout>
                    <FormLayout className='Timecode__time'>
                      <Input placeholder='Время' value={data.timecodes[i]['time']} onChange={e => (this.onTimeChange(e.target.value, i))}/>
                    </FormLayout>
                  </div>
                </Cell>
              )
            })
          }
          <CellButton onClick={this.addTimecode} before={
            <Avatar size={21}><Icon24Add fill='white' width={20} height={20}/></Avatar>
          }>Добавить таймкод</CellButton>
        </Group>

        <div style={{ height: 68 }}/>

        <FixedLayout vertical='bottom' filled>
          <Div>
            <Button onClick={this.props.goBack} stretched size='xl'>
              Завершить
            </Button>
          </Div>
        </FixedLayout>

      </Panel>
    )
  }
}

export default Editor;
