import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardActionArea, Dialog, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const Portfolio = () => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const photos = [
        process.env.PUBLIC_URL + '/hero3.png',
        process.env.PUBLIC_URL + '/hero2.png',
        process.env.PUBLIC_URL + '/hero3.png',
        process.env.PUBLIC_URL + '/hero2.png',
    ];

    const handleClickOpen = (photo) => {
        setSelectedPhoto(photo);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedPhoto(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
       <Typography 
  variant="h6" 
  sx={{ 
    marginBottom: 3, 
    fontWeight: 700, 
    color: '#222', 
    textAlign: 'left',  
    width: '100%',      
  }}
>
  My Portfolio
</Typography>


            <Grid container spacing={3} justifyContent="center">
                {photos.map((photo, index) => (
                    <Grid item key={index} xs={2} sm={2} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Card 
                            sx={{
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                                },
                            }}
                        >
                            <CardActionArea onClick={() => handleClickOpen(photo)}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={photo}
                                    alt={`Portfolio ${index + 1}`}
                                    sx={{
                                        objectFit: 'cover',
                                        borderRadius: '16px',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                        },
                                    }}
                                />
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogContent sx={{ position: 'relative', padding: 0 }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                        }}
                    >
                        <Close />
                    </IconButton>
                    <img
                        src={selectedPhoto}
                        alt="Fullscreen Portfolio"
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '16px',
                            boxShadow: '0 6px 30px rgba(0, 0, 0, 0.2)',
                            transition: 'transform 0.3s ease-in-out',
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Portfolio;
