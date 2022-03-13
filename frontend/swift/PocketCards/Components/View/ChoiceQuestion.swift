//
//  ChoiceQuestion.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

struct ChoiceQuestion: View {
    
    var question: String
    var choices: [String]
    var isShowError: String
    var onChoice: (_: String) -> Void
    
    var body: some View {
        VStack {
            HStack {
                GeometryReader { geometry in
                    Text(question)
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
                        .font(.system(size: 48, design: .default))
                        .padding(.leading, 32)
                        .border(Color.purple, width: 5)
                }
            }
                .padding(.bottom, 32)
                .padding(.top, 32)
            
            ForEach (0..<choices.count) { idx in
                let item = choices[idx]
                let index = String(idx + 1)
                let isError : Bool = !self.isShowError.isEmpty ? self.isShowError == index : false
                
                ChoiceButton(text: item, isError: isError) {
                    self.onChoice(index)
                }
            }
        }
        .padding(.horizontal, 64)
        .padding(.bottom, 64)
    }
}

struct ChoiceQuestion_Previews: PreviewProvider {
    static var previews: some View {
        ChoiceQuestion(question: "aaaaaaaa", choices: ["AAA", "BBB", "CCCC", "DDDD"], isShowError: "") { t in
        }
.previewInterfaceOrientation(.landscapeLeft)
    }
}
