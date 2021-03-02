import React, { useState, useEffect } from 'react';
import {
    Button,
    Card, CardContent, CardHeader,
    CircularProgress,
    Container,
    makeStyles,
} from '@material-ui/core';
import { ArrowDownward } from '@material-ui/icons';

// This is a wrapper for google.script.run that lets us use promises.
import server from '../../utils/server';

const { serverFunctions } = server;

export default function SCIPacker() {
    const styles = useStyles();
    const [name, setName] = useState('');
    const [href, setHref] = useState('');
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        serverFunctions
            .packTranslations()
            .then((base64) => {
                setHref(generateHref(base64));
                setName(generateName());
            })
            .catch(setError);
    }, []);

    const contents = (function () {
        if (error) {
            console.error(error);
            return (
                <Card key="error" className={styles.cardError}>
                    <CardHeader title="Unhandled Error" />
                    <CardContent>
                        <pre>
                            {error && error.stack || `${error}`}
                        </pre>
                    </CardContent>
                </Card>
            );
        }

        if (href) {
            return (
                <Button
                    key="link"
                    className={styles.downloadButton}
                    variant="contained"
                    color="primary"
                    download={name}
                    href={href}
                    startIcon={<ArrowDownward />}
                >
                    {name}
                </Button>
            );
        }

        return <CircularProgress key="loader" />
    }());

    return (
        <Container>{contents}</Container>
    );
};

function generateName(): string {
    const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, -5);
    const filename = `qfg1he_${timestamp}.tar.gz`;

    return filename;
}

function generateHref(result): string {
    return `data:text/plain;base64,${result}`;
}

const useStyles = makeStyles(() => ({
    cardError: {
        backgroundColor: 'lightpink',
        color: 'darkred',
    },
    downloadButton: {
        textTransform: 'initial',
    }
}));
