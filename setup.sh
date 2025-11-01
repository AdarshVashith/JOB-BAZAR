#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Authentication App Setup Script${NC}"
echo -e "${GREEN}=====================================${NC}\n"

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"
echo -e "${GREEN}✓ npm version: $(npm -v)${NC}\n"

# Backend setup
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists${NC}"
fi

echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}\n"
else
    echo -e "${RED}❌ Backend installation failed${NC}"
    exit 1
fi

# Frontend setup
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd ../frontend

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists${NC}"
fi

echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}\n"
else
    echo -e "${RED}❌ Frontend installation failed${NC}"
    exit 1
fi

# Summary
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✓ Setup Completed Successfully!${NC}"
echo -e "${GREEN}=====================================${NC}\n"

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Ensure MongoDB is running:"
echo "   Local: mongod"
echo "   Cloud: Update MONGODB_URI in backend/.env with MongoDB Atlas connection string"
echo ""
echo "2. Start Backend (from backend folder):"
echo "   npm start"
echo ""
echo "3. Start Frontend (from frontend folder in new terminal):"
echo "   npm start"
echo ""
echo "4. Open browser and navigate to http://localhost:3000"
echo ""
echo "📖 For more information, see README.md or QUICKSTART.md"