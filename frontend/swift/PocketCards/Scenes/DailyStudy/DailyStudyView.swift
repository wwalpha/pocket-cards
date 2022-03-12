//
//  DailyStudyView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//
import SwiftUI

struct DailyStudyView: View {
    var interactor: DailyStudyBusinessLogic?
    private var subject: String;
    
    @ObservedObject var viewModel = DailyStudyViewModel()
    
    init(subject:String) {
        self.subject = subject
    }
    
    var body: some View {
        if viewModel.title.isEmpty {
            Text("Loading....")
                .onAppear {
                    interactor?.loadQuestion()
                }
        } else if viewModel.title == "Nothing" {
            Text("今日のテストは終わりました")
                .font(.system(size: 64, design: .default))
        } else {
            // Language
            if subject == SUBJECT.LANGUAGE {
                ChoiceQuestion(
                    question: viewModel.title,
                    choices: viewModel.choices,
                    isShowError: viewModel.isShowError,
                    onChoice: interactor!.onChoice
                )
            } else {
                // Society or Science
                FlashCard(
                    question: viewModel.title,
                    answer: viewModel.answer,
                    action: interactor!.onAction
                )
            }
        }
    }
}

extension DailyStudyView: DailyStudyDisplayLogic {

    func showError(index: String) {
        self.viewModel.isShowError = index
    }
    
    func showNext(title: String, answer: String, choices: [String]?) {
        self.viewModel.title = title
        self.viewModel.choices = choices != nil ? choices! : []
        self.viewModel.answer = answer
        self.viewModel.isShowError = ""
    }
    
    func showNothing() {
        self.viewModel.title = "Nothing"
    }
}

extension DailyStudyView {
    func configureView() -> some View {
        var view = self
        let interactor = DailyStudyInteractor(subject: self.subject)
        let presenter = DailyStudyPresenter()
        
        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view
        
        return view
    }
}

struct DailyStudyView_Previews: PreviewProvider {
    static var previews: some View {
        DailyStudyView(subject: SUBJECT.LANGUAGE)
    }
}
