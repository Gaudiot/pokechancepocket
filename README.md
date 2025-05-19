# PokeChance Pocket

A tool to help optimize pack opening in Pokemon TCG Pocket by calculating probabilities of getting new cards.

## The Problem

In Pokemon TCG Pocket, players are limited to opening only 2 packs per day. With multiple collections and variants available, choosing which packs to open becomes a strategic decision for collectors aiming to complete their collection efficiently.

## The Solution

This project provides probability calculations to determine the chances of obtaining new cards from different collections. By analyzing the odds mathematically, it helps players make informed decisions about which packs to open, maximizing the value of their limited daily packs.

## Project Structure

This is a monorepo containing:

- **Frontend**: React application for the user interface
- **Backend**: Golang server handling probability calculations

## Features

- Probability calculations for obtaining new cards
- Collection tracking
- Pack opening optimization recommendations
- Integration with Google Sheets for data management

## Getting Started

To run the backend: `make run-backend`
