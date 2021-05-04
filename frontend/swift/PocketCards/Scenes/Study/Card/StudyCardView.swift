//
//  StudyCardView.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/14.
//

import SwiftUI

struct StudyCardView: View {
    var body: some View {
        let frontView = FrontCard(text: "AA")
        let backView = BackCard(text: "BBB")

        VStack {
            FlippingView(frontView: AnyView(frontView), backView: AnyView(backView))
                .padding(.vertical, 60)
            
            HStack {
                Button(action: /*@START_MENU_TOKEN@*/{}/*@END_MENU_TOKEN@*/, label: {
                    Text("知ってる")
                        .frame(width: 100, height: 100)
                        .imageScale(.large)
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                    
                }).padding(.horizontal, 10)
                
                Button(action: /*@START_MENU_TOKEN@*/{}/*@END_MENU_TOKEN@*/, label: {
                    Text("知らない")
                        .frame(width: 100, height: 100)
                        .imageScale(.large)
                        .background(Color.orange)
                        .foregroundColor(.white)
                        .clipShape(/*@START_MENU_TOKEN@*/Circle()/*@END_MENU_TOKEN@*/)
                    
                }).padding(.horizontal, 10)
            }
            
            
            Spacer()
        }
        .frame(maxWidth: /*@START_MENU_TOKEN@*/.infinity/*@END_MENU_TOKEN@*/)
        .background(Color("Grey300mki98"))
    }
}

struct FrontCard : View {
    var text: String
    
    init(text: String) {
        self.text = text
    }
    
    var body: some View {
        Text(text)
            .font(.largeTitle)
            .padding(5)
            .frame(width: 300, height: 300, alignment: .center)
            .background(Color.white)
            .compositingGroup()
            .shadow(color: .gray, radius: 3, x: 10, y: 10)
    }
}

struct BackCard : View {
    var text: String
    
    init(text: String) {
        self.text = text
    }
    
    var body: some View {
        Text(text).padding(5).frame(width: 300, height: 300)
        
    }
}

struct StudyCardView_Previews: PreviewProvider {
    static var previews: some View {
        StudyCardView()
    }
}
