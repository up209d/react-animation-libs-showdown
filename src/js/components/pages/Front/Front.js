import React from 'react';
import {
  withStyles,
  Grid,
  FormControl,
  TextField,
  Button,
  CircularProgress,
  Typography
} from 'material-ui';

import utils from 'js/utils';

const style = theme => ({
  container: {}
});

class Home extends React.Component {
  render() {
    const { props } = this;
    const { classes } = props;
    return (
      <Grid className={classes.container} container justify={'center'} alignItems={'center'}>
        <Grid item xs={12} md={6} lg={4}>
          <Typography align={'center'} variant={'display1'} color={'primary'}>FRONT PAGE</Typography>
          <Typography align={'center'} variant={'body1'} color={'primary'}>
            <img style={{display:'inline-block'}} width={320} src={require('images/test.jpg')} alt={'test'}/>
          </Typography>
        </Grid>
      </Grid>
    )
  }
};

export default utils.getConnectAllStateActions(withStyles(style,{withTheme: true})(Home));